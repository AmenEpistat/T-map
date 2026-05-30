import { apiClient } from '@/shared/api/client';
import type {
    AdminModerationDecision,
    AdminVenueModeration,
    AdminVenueModerationPage,
    AdminVenuesListParams,
} from '@/shared/api/types';

export const adminVenuesApi = {
    getModerationQueue: async (
        params: AdminVenuesListParams = {}
    ): Promise<AdminVenueModerationPage> => {
        const response = await apiClient.get<AdminVenueModerationPage>(
            '/admin/venues',
            { params }
        );
        return response.data;
    },

    getById: async (id: string): Promise<AdminVenueModeration> => {
        const response = await apiClient.get<AdminVenueModeration>(
            `/admin/venues/${id}`
        );
        return response.data;
    },

    verify: async (id: string): Promise<AdminVenueModeration> => {
        const response = await apiClient.patch<AdminVenueModeration>(
            `/admin/venues/${id}/verify`
        );
        return response.data;
    },

    reject: async (
        id: string,
        decision: AdminModerationDecision = {}
    ): Promise<AdminVenueModeration> => {
        const response = await apiClient.patch<AdminVenueModeration>(
            `/admin/venues/${id}/reject`,
            decision
        );
        return response.data;
    },
};
