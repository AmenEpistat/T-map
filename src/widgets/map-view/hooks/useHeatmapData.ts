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
                zoom: Math.round(mapStore.viewState.zoom * 10) / 10,
            }),
            ({ zoom }) => {
                if (zoom >= ZOOM_ICON) {
                    mapStore.loadVenues();
                }
                if (zoom < ZOOM_ICON) {
                    mapStore.loadClusters();
                }
            },
            {
                fireImmediately: true,
                delay: 500,
            }
        );

        return () => dispose();
    }, []);
};
