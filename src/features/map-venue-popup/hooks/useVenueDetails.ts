import { useMapPopup } from '@/shared/hooks/useMapPopup.ts';
import { publicVenueStore } from '@/entities/public-venue';
import { useEffect } from 'react';
import { reaction } from 'mobx';

export const useVenueDetails = () => {
    const { data, isLoading } = publicVenueStore.venueDetail;

    useEffect(() => {
        const dispose = reaction(
            () => publicVenueStore.selectedVenueIndex,
            async (id: string | null) => {
                if (!id) return;
                await publicVenueStore.loadVenueDetails();
            }
        );

        return () => dispose();
    }, []);

    const { close, handleShare } = useMapPopup({
        paramName: 'venue',
        data,
        idKey: 'id',
        reset: () => publicVenueStore.venueDetail.reset(),
        onSelect: (id: string | null) =>
            publicVenueStore.setSelectedVenueIndex(id),
        shareText: (d) =>
            `Посмотри аналитику транзакций для заведения ${d.name} в T-map`,
        shareTitle: (d) => `Заведение ${d.name}`,
    });

    return {
        closeVenuePopup: close,
        handleShare,
        data,
        isLoading,
        isPopupOpen: publicVenueStore.isVenueSelected,
    };
};
