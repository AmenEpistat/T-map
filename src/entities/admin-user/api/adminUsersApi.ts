import { apiClient } from '@/shared/api/client';
import type {
    AdminUserModeration,
    AdminUserModerationPage,
    AdminUsersSearchParams,
} from '@/shared/api/types';

export const adminUsersApi = {
    search: async (
        params: AdminUsersSearchParams = {}
    ): Promise<AdminUserModerationPage> => {
        const response = await apiClient.get<AdminUserModerationPage>(
            '/admin/users/search',
            { params }
        );

        return response.data;
    },

    block: async (id: string): Promise<AdminUserModeration> => {
        const response = await apiClient.patch<AdminUserModeration>(
            `/admin/users/${id}/block`
        );

        return response.data;
    },

    unblock: async (id: string): Promise<AdminUserModeration> => {
        const response = await apiClient.patch<AdminUserModeration>(
            `/admin/users/${id}/unblock`
        );

        return response.data;
    },
};
