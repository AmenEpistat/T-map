import { useEffect } from 'react';
import { reaction } from 'mobx';
import { mapStore } from '@/entities/map';
import { ZOOM_ICON } from '@/widgets/map-view/model/constants.ts';

export const useHeatmapData = () => {
    useEffect(() => {
        const dispose = reaction(
            () => ({
                bounds: mapStore.bounds,
                categories: mapStore.selectedCategories.slice(),
                zoom: mapStore.viewState.zoom,
            }),
            ({ zoom }) => {
                if (zoom >= ZOOM_ICON) {
                    mapStore.loadVenues();
                }
                mapStore.loadClusters();
            },
            {
                fireImmediately: true,
                delay: 300,
            }
        );

        return () => dispose();
    }, []);
};
