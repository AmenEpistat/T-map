import { mapStore } from '@/entities/map';
import { useEffect } from 'react';
import { reaction } from 'mobx';

export const useClusterDetails = () => {
    useEffect(() => {
        const dispose = reaction(
            () => mapStore.selectedClusterIndex,
            async (h3Index) => {
                if (!h3Index) return;
                await mapStore.loadClusterDetails();
            }
        );

        return () => dispose();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const h3Index = params.get('cluster');
        if (h3Index) {
            mapStore.setClusterIndex(h3Index);
        }
    }, []);

    const openClusterPopup = (h3Index: string) => {
        mapStore.setClusterIndex(h3Index);

        const url = new URL(window.location.href);
        url.searchParams.set('cluster', h3Index);

        window.history.pushState({}, '', url.toString());
    };

    const closeClusterPopup = () => {
        mapStore.setClusterIndex(null);
        mapStore.clusterDetail.reset();

        const url = new URL(window.location.href);
        url.searchParams.delete('cluster');
        window.history.pushState({}, '', url);
    };

    const isPopupOpen = mapStore.isClusterSelected;

    const { data, isLoading } = mapStore.clusterDetail;

    const handleShare = async () => {
        const shareUrl = new URL(window.location.href);
        if (data?.h3Index) {
            shareUrl.searchParams.set('cluster', data.h3Index);
        }

        const shareData = {
            title: `Район ${data?.districtName}`,
            text: `Посмотри аналитику транзакций для района ${data?.districtName} на T-map`,
            url: shareUrl.toString(),
        };

        await navigator.share(shareData);
    };

    return {
        openClusterPopup,
        closeClusterPopup,
        isPopupOpen,
        data,
        isLoading,
        handleShare,
    };
};
