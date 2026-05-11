import { apiClient } from '@/shared/api';
import type { PublicVenue } from '@/entities/public-venue';

export const publicVenueApi = {
    getVenueById: async (id: string) => {
        return await apiClient.get<PublicVenue>(`/venues/${id}`);
    },
};
