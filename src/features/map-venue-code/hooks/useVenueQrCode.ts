import { publicVenueStore } from '@/entities/public-venue';

export const useVenueQrCode = () => {
    const { data, isLoading } = publicVenueStore.venueQrCode;

    const clearQrCode = () => publicVenueStore.clearVenueQrCode();

    return {
        isLoading,
        data,
        clearQrCode,
    };
};
