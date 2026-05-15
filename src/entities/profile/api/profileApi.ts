import { apiClient } from '@/shared/api';
import type { ChangePasswordPayload } from '@/entities/profile/model/types.ts';

export const profileApi = {
    changePassword(data: ChangePasswordPayload) {
        return apiClient.patch('/profile/password', data);
    },
};
