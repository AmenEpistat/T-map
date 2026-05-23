import { useCallback, useRef } from 'react';
import { mapStore } from '@/entities/map';
import type { ViewStateChangeEvent } from 'react-map-gl/mapbox-legacy';
import type { InteractionState } from '@deck.gl/core';

export const useMapControl = () => {
    const mapRef = useRef<any>(null);

    const updateBounds = useCallback(() => {
        if (!mapRef.current) return;
        const map = mapRef.current.getMap();
        const bounds = map.getBounds();

        if (bounds) {
            mapStore.setBounds({
                swLat: bounds.getSouthWest().lat,
                swLng: bounds.getSouthWest().lng,
                neLat: bounds.getNorthEast().lat,
                neLng: bounds.getNorthEast().lng,
            });
        }
    }, []);

    const handleViewStateChange = useCallback((e: ViewStateChangeEvent) => {
        mapStore.setViewState(e.viewState);
    }, []);

    const handleInteractionStateChange = useCallback(
        (state: InteractionState) => {
            if (!state.isDragging && !state.isPanning && !state.isZooming) {
                updateBounds();
            }
        },
        [updateBounds]
    );

    const handleMapLoad = useCallback(() => {
        updateBounds();
    }, [updateBounds]);

    return {
        mapRef,
        handleViewStateChange,
        handleInteractionStateChange,
        handleMapLoad,
    };
};
