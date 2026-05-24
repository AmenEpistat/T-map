import { describe, it, expect, vi, beforeEach } from 'vitest';
import { profileApi } from './profileApi';
import { apiClient } from '@/shared/api';

vi.mock('@/shared/api', () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('profileApi', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('changePassword', () => {
        it('вызывает patch с правильными данными', async () => {
            vi.mocked(apiClient.patch).mockResolvedValue({});
            const payload = { currentPassword: 'old', newPassword: 'new' };

            await profileApi.changePassword(payload);

            expect(apiClient.patch).toHaveBeenCalledWith(
                '/profile/password',
                payload
            );
        });
    });

    describe('getLoyaltyHistory', () => {
        it('передаёт page и size', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({});

            await profileApi.getLoyaltyHistory(2, 10);

            expect(apiClient.get).toHaveBeenCalledWith(
                '/profile/loyalty/history',
                { params: { page: 2, size: 10 } }
            );
        });

        it('передаёт нулевую страницу', async () => {
            vi.mocked(apiClient.get).mockResolvedValue({});
            await profileApi.getLoyaltyHistory(0, 10);
            expect(apiClient.get).toHaveBeenCalledWith(
                '/profile/loyalty/history',
                { params: { page: 0, size: 10 } }
            );
        });
    });
});
