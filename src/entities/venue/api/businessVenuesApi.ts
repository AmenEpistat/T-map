import { apiClient } from '@/shared/api/client';
import type {
    OwnerVenue,
    VenueCreatePayload,
    VenueUpdatePayload,
} from '../model/types';

const BASE = '/business/venues';

export const businessVenuesApi = {
    getMyVenues: async (): Promise<OwnerVenue[]> => {
        const response = await apiClient.get<OwnerVenue[]>(BASE);
        return response.data;
    },

    getMyVenueById: async (id: string): Promise<OwnerVenue> => {
        const response = await apiClient.get<OwnerVenue>(`${BASE}/${id}`);
        return response.data;
    },

    createVenue: async (payload: VenueCreatePayload): Promise<OwnerVenue> => {
        const response = await apiClient.post<OwnerVenue>(BASE, payload);
        return response.data;
    },

    updateVenue: async (
        id: string,
        payload: VenueUpdatePayload
    ): Promise<OwnerVenue> => {
        const response = await apiClient.put<OwnerVenue>(
            `${BASE}/${id}`,
            payload
        );
        return response.data;
    },

    deleteVenue: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE}/${id}`);
    },
};
