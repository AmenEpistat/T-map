import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChangePassword } from './useChangePassword';
import { profileStore } from '@/entities/profile';

const mockForm = {
    resetFields: vi.fn(),
    setFields: vi.fn(),
    useForm: vi.fn(),
};

vi.mock('antd', () => ({
    Form: {
        useForm: () => [mockForm],
    },
}));

vi.mock('@/entities/profile', () => ({
    profileStore: {
        changePasswordState: { isLoading: false, error: null, reset: vi.fn() },
        changePassword: vi.fn(),
    },
}));

describe('useChangePassword', () => {
    const onCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        profileStore.changePasswordState.error = null;
    });

    it('начальное состояние — нет ошибки, не загружается', () => {
        const { result } = renderHook(() => useChangePassword(onCancel));
        expect(result.current.serverError).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    describe('handleFinish — успех', () => {
        it('вызывает onCancel и сбрасывает форму', async () => {
            vi.mocked(profileStore.changePassword).mockResolvedValue(true);

            const { result } = renderHook(() => useChangePassword(onCancel));
            await act(async () => {
                await result.current.handleFinish({
                    currentPassword: 'old',
                    newPassword: 'new',
                    confirmPassword: 'new',
                });
            });

            expect(onCancel).toHaveBeenCalled();
            expect(mockForm.resetFields).toHaveBeenCalled();
            expect(profileStore.changePasswordState.reset).toHaveBeenCalled();
        });
    });

    describe('handleFinish — ошибка', () => {
        it('показывает ошибку 401 — неверный пароль', async () => {
            vi.mocked(profileStore.changePassword).mockResolvedValue(false);
            profileStore.changePasswordState.error = {
                status: 401,
                message: '',
            };

            const { result } = renderHook(() => useChangePassword(onCancel));
            await act(async () => {
                await result.current.handleFinish({
                    currentPassword: 'wrong',
                    newPassword: 'new',
                    confirmPassword: 'new',
                });
            });

            expect(result.current.serverError).toBe('Неверный текущий пароль.');
            expect(onCancel).not.toHaveBeenCalled();
        });

        it('показывает ошибку 400', async () => {
            vi.mocked(profileStore.changePassword).mockResolvedValue(false);
            profileStore.changePasswordState.error = {
                status: 400,
                message: '',
            };

            const { result } = renderHook(() => useChangePassword(onCancel));
            await act(async () => {
                await result.current.handleFinish({
                    currentPassword: 'old',
                    newPassword: 'new',
                    confirmPassword: 'new',
                });
            });

            expect(result.current.serverError).toBe(
                'Проверьте введённые данные.'
            );
        });

        it('показывает дефолтную ошибку для неизвестного статуса', async () => {
            vi.mocked(profileStore.changePassword).mockResolvedValue(false);
            profileStore.changePasswordState.error = {
                status: 500,
                message: '',
            };

            const { result } = renderHook(() => useChangePassword(onCancel));
            await act(async () => {
                await result.current.handleFinish({
                    currentPassword: 'old',
                    newPassword: 'new',
                    confirmPassword: 'new',
                });
            });

            expect(result.current.serverError).toBe(
                'Не удалось сменить пароль. Попробуйте позже.'
            );
        });
    });

    describe('handleValuesChange', () => {
        it('сбрасывает serverError при изменении полей', async () => {
            vi.mocked(profileStore.changePassword).mockResolvedValue(false);
            profileStore.changePasswordState.error = {
                status: 401,
                message: '',
            };

            const { result } = renderHook(() => useChangePassword(onCancel));

            await act(async () => {
                await result.current.handleFinish({
                    currentPassword: 'wrong',
                    newPassword: 'new',
                    confirmPassword: 'new',
                });
            });

            expect(result.current.serverError).not.toBeNull();

            act(() => result.current.handleValuesChange());

            expect(result.current.serverError).toBeNull();
        });
    });
});
