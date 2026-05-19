import { apiClient } from '@/shared/api';
import type {
    PublicVenue,
    VenueQrCode,
    VenueSearch,
} from '@/entities/public-venue';

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

    getVenueQrCode: async (venueId: string, ruleId: string) => {
        return await apiClient.get<VenueQrCode>(
            `/venues/${venueId}/loyalty-rules/${ruleId}/qr`,
            {
                params: {
                    id: venueId,
                    ruleId,
                },
            }
        );
    },
};
