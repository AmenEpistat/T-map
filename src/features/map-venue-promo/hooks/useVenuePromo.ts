import { publicVenueStore } from '@/entities/public-venue';

export const useVenuePromo = () => {
    const { data, isLoading } = publicVenueStore.venueDetail;

    return {
        data: data?.promotions || [],
        isLoading,
    };
};
