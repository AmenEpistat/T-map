import { useEffect } from 'react';
import { reaction } from 'mobx';
import { mapStore } from '@/entities/map';

export const useHeatmapData = () => {
    useEffect(() => {
        const dispose = reaction(
            () => ({
                bounds: mapStore.bounds,
                categories: mapStore.selectedCategories.slice(),
            }),
            () => mapStore.loadClusters(),
            {
                fireImmediately: true,
                delay: 300,
            }
        );

        return () => dispose();
    }, []);
};
