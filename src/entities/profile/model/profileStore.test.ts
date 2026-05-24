import { describe, it, expect, vi, beforeEach } from 'vitest';
import { profileStore } from './profileStore';
import { profileApi } from '@/entities/profile/api/profileApi';

vi.mock('@/entities/profile/api/profileApi', () => ({
    profileApi: {
        changePassword: vi.fn(),
        getLoyaltyHistory: vi.fn(),
    },
}));

describe('ProfileStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        profileStore.setPage(0);
    });

    describe('setPage', () => {
        it('устанавливает страницу', () => {
            profileStore.setPage(3);
            expect(profileStore.page).toBe(3);
        });
    });

    describe('changePassword', () => {
        const payload = { currentPassword: 'old', newPassword: 'new' };

        it('возвращает true при успехе', async () => {
            vi.mocked(profileApi.changePassword).mockResolvedValue({
                data: {},
            } as any);

            const result = await profileStore.changePassword(payload);
            expect(result).toBe(true);
        });

        it('возвращает false при ошибке', async () => {
            vi.mocked(profileApi.changePassword).mockRejectedValue(
                new Error('Wrong password')
            );
            const result = await profileStore.changePassword(payload);
            expect(result).toBe(false);
        });

        it('вызывает api с правильными данными', async () => {
            vi.mocked(profileApi.changePassword).mockResolvedValue({
                data: {},
            } as any);

            await profileStore.changePassword(payload);
            expect(profileApi.changePassword).toHaveBeenCalledWith(payload);
        });
    });

    describe('loadLoyaltyHistory', () => {
        it('вызывает api с текущей страницей и PAGE_SIZE', async () => {
            vi.mocked(profileApi.getLoyaltyHistory).mockResolvedValue({
                data: {},
            } as any);

            profileStore.setPage(2);
            await profileStore.loadLoyaltyHistory();
            expect(profileApi.getLoyaltyHistory).toHaveBeenCalledWith(
                2,
                expect.any(Number)
            );
        });
    });
});
