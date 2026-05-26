import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './authApi';
import { apiClient, refreshAuthSession } from '@/shared/api';

vi.mock('@/shared/api', () => ({
    apiClient: { post: vi.fn() },
    refreshAuthSession: vi.fn(),
}));

const mockAuthResponse = {
    accessToken: 'token123',
    userId: '1',
    email: 'test@test.com',
    nickname: 'user',
    role: 'USER',
};

describe('authApi', () => {
    beforeEach(() => vi.clearAllMocks());

    it('register вызывает правильный эндпоинт и возвращает данные', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockAuthResponse });
        const data = {
            email: 'test@test.com',
            password: '123',
            nickname: 'user',
        };

        const result = await authApi.register(data as any);

        expect(apiClient.post).toHaveBeenCalledWith('/auth/register', data);
        expect(result).toEqual(mockAuthResponse);
    });

    it('login вызывает правильный эндпоинт и возвращает данные', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockAuthResponse });
        const data = { email: 'test@test.com', password: '123' };

        const result = await authApi.login(data);

        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', data);
        expect(result).toEqual(mockAuthResponse);
    });

    it('refresh это refreshAuthSession', () => {
        expect(authApi.refresh).toBe(refreshAuthSession);
    });

    it('logout вызывает правильный эндпоинт', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({});
        await authApi.logout();
        expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
});
