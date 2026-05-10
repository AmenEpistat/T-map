import { mapStore } from '@/entities/map';
import { useEffect } from 'react';
import { reaction } from 'mobx';
import { useMapPopup } from '@/shared/hooks/useMapPopup.ts';
import { publicVenueStore } from '@/entities/public-venue';

export const useClusterDetails = () => {
    const { data, isLoading } = mapStore.clusterDetail;

    useEffect(() => {
        const dispose = reaction(
            () => mapStore.selectedClusterIndex,
            async (h3Index) => {
                if (!h3Index) return;
                publicVenueStore.setSelectedVenueIndex(null);
                await mapStore.loadClusterDetails();
            }
        );

        return () => dispose();
    }, []);

    const { close, handleShare } = useMapPopup({
        paramName: 'cluster',
        onSelect: (h3Index: string | null) => mapStore.setClusterIndex(h3Index),
        reset: () => mapStore.clusterDetail.reset(),
        idKey: 'h3Index',
        data,
        shareTitle: (d) => `Район ${d.districtName}`,
        shareText: (d) =>
            `Посмотри аналитику транзакций для района ${d.districtName} на T-map`,
    });

    const isPopupOpen = mapStore.isClusterSelected;

    return {
        closeClusterPopup: close,
        isPopupOpen,
        data,
        isLoading,
        handleShare,
    };
};
