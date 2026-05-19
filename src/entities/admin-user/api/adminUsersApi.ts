import { apiClient } from '@/shared/api/client';
import type {
    AdminUserModeration,
    AdminUserModerationPage,
    AdminUsersSearchParams,
} from '@/shared/api/types';

type AdminUsersSearchRequest = Omit<
    AdminUsersSearchParams,
    'email' | 'nickname'
> & {
    query?: string;
};

export const adminUsersApi = {
    search: async ({
        query,
        ...params
    }: AdminUsersSearchRequest = {}): Promise<AdminUserModerationPage> => {
        const normalizedQuery = query?.trim() || undefined;

        const response = await apiClient.get<AdminUserModerationPage>(
            '/admin/users/search',
            {
                params: {
                    ...params,
                    email: normalizedQuery,
                    nickname: normalizedQuery,
                },
            }
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
