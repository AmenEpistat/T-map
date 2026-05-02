import { observer } from 'mobx-react-lite';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapLayers } from '@/widgets/map-view/hooks/useMapLayers.ts';
import { MAP_STYLE } from '@/widgets/map-view/model/constants.ts';
import styles from './MapView.module.scss';
import { mapStore } from '@/entities/map';
import { useHeatmapData } from '@/widgets/map-view/hooks/useHeatmapData.ts';
import { useCallback, useRef } from 'react';
import type { ViewStateChangeEvent } from 'react-map-gl/mapbox-legacy';

const MapView = observer(() => {
    useHeatmapData();
    const layers = useMapLayers();

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

    const handleViewStateChange = useCallback(
        (e: ViewStateChangeEvent) => {
            mapStore.setViewState(e.viewState);
            updateBounds();
        },
        [updateBounds]
    );

    const handleMapLoad = useCallback(() => {
        updateBounds();
    }, [updateBounds]);

    return (
        <div className={styles['map']}>
            <DeckGL
                viewState={mapStore.viewState}
                onViewStateChange={handleViewStateChange}
                controller={true}
                layers={layers}
            >
                <Map
                    ref={mapRef}
                    reuseMaps
                    mapStyle={MAP_STYLE}
                    onLoad={handleMapLoad}
                />
            </DeckGL>
        </div>
    );
});

export default MapView;
