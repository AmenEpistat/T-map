import { apiClient } from '@/shared/api';
import type { ChangePasswordPayload } from '@/entities/profile/model/types.ts';

export const profileApi = {
    changePassword(data: ChangePasswordPayload) {
        return apiClient.patch('/profile/password', data);
    },

    getLoyaltyHistory(page: number, size: number) {
        return apiClient.get('/profile/loyalty/history', {
            params: { page, size },
        });
    },
};
