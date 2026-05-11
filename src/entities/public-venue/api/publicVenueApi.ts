import { apiClient } from '@/shared/api';
import type { PublicVenue, VenueSearch } from '@/entities/public-venue';

export const publicVenueApi = {
    getVenueById: async (id: string) => {
        return await apiClient.get<PublicVenue>(`/venues/${id}`);
    },

    getVenueBySearch: async (search: string) => {
        return await apiClient.get<VenueSearch[]>('/venues/search', {
            params: {
                q: search,
            },
        });
    },
};
