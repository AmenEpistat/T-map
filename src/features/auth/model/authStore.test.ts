import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authStore } from './authStore';
import { authApi } from '../api';
import { setAccessToken } from '@/shared/api';

vi.mock('../api', () => ({
    authApi: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refresh: vi.fn(),
    },
}));

vi.mock('@/shared/api', () => ({
    setAccessToken: vi.fn(),
    registerAuthCallbacks: vi.fn(),
}));

const mockResponse = {
    accessToken: 'token123',
    userId: '1',
    email: 'test@test.com',
    nickname: 'user',
    role: 'USER' as const,
};

describe('AuthStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authStore.clearAuth();
        authStore.isInitializing = false;
    });

    describe('isAuthenticated', () => {
        it('false без токена и юзера', () => {
            expect(authStore.isAuthenticated).toBe(false);
        });

        it('true с токеном и юзером', () => {
            authStore.setAuth(mockResponse);
            expect(authStore.isAuthenticated).toBe(true);
        });
    });

    describe('isAdmin', () => {
        it('false для обычного пользователя', () => {
            authStore.setAuth(mockResponse);
            expect(authStore.isAdmin).toBe(false);
        });

        it('true для ADMIN', () => {
            authStore.setAuth({ ...mockResponse, role: 'ADMIN' });
            expect(authStore.isAdmin).toBe(true);
        });
    });

    describe('setAuth', () => {
        it('устанавливает accessToken, user и вызывает setAccessToken', () => {
            authStore.setAuth(mockResponse);

            expect(authStore.accessToken).toBe('token123');
            expect(authStore.user?.email).toBe('test@test.com');
            expect(setAccessToken).toHaveBeenCalledWith('token123');
        });
    });

    describe('clearAuth', () => {
        it('сбрасывает токен и юзера', () => {
            authStore.setAuth(mockResponse);
            authStore.clearAuth();

            expect(authStore.accessToken).toBeNull();
            expect(authStore.user).toBeNull();
            expect(setAccessToken).toHaveBeenCalledWith(null);
        });
    });

    describe('login', () => {
        it('вызывает api и сохраняет данные', async () => {
            vi.mocked(authApi.login).mockResolvedValue(mockResponse);
            await authStore.login({ email: 'test@test.com', password: '123' });

            expect(authStore.accessToken).toBe('token123');
            expect(authStore.user?.email).toBe('test@test.com');
        });

        it('пробрасывает ошибку при неудаче', async () => {
            vi.mocked(authApi.login).mockRejectedValue(
                new Error('Unauthorized')
            );
            await expect(
                authStore.login({ email: 'bad', password: 'bad' })
            ).rejects.toThrow('Unauthorized');
        });
    });

    describe('register', () => {
        it('вызывает api и сохраняет данные', async () => {
            vi.mocked(authApi.register).mockResolvedValue(mockResponse);
            await authStore.register({
                email: 'test@test.com',
                password: '123',
                nickname: 'user',
            } as any);
            expect(authStore.accessToken).toBe('token123');
        });
    });

    describe('logout', () => {
        it('очищает auth после успешного запроса', async () => {
            authStore.setAuth(mockResponse);
            vi.mocked(authApi.logout).mockResolvedValue(undefined);

            await authStore.logout();

            expect(authStore.accessToken).toBeNull();
            expect(authStore.user).toBeNull();
        });

        it('очищает auth даже если запрос упал', async () => {
            authStore.setAuth(mockResponse);
            vi.mocked(authApi.logout).mockRejectedValue(new Error('Network'));

            await authStore.logout().catch(() => {});

            expect(authStore.accessToken).toBeNull();
        });
    });

    describe('refresh', () => {
        it('обновляет токен', async () => {
            vi.mocked(authApi.refresh).mockResolvedValue(mockResponse);
            await authStore.refresh();
            expect(authStore.accessToken).toBe('token123');
        });
    });
});
