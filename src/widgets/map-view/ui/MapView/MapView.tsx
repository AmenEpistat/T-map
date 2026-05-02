import { observer } from 'mobx-react-lite';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapLayers } from '@/widgets/map-view/hooks/useMapLayers.ts';
import { MAP_STYLE } from '@/widgets/map-view/model/constants.ts';
import styles from './MapView.module.scss';
import { mapStore } from '@/entities/map';
import { useHeatmapData } from '@/widgets/map-view/hooks/useHeatmapData.ts';
import { useCallback } from 'react';
import type { ViewStateChangeEvent } from 'react-map-gl/mapbox-legacy';

const MapView = observer(() => {
    useHeatmapData();
    const layers = useMapLayers();

    const handleMapChange = useCallback((e: ViewStateChangeEvent) => {
        const bounds = e.target.getBounds();
        mapStore.setBounds({
            swLat: bounds.getSouthWest().lat,
            swLng: bounds.getSouthWest().lng,
            neLat: bounds.getNorthEast().lat,
            neLng: bounds.getNorthEast().lng,
        });
    }, []);

    const handleViewStateChange = useCallback((e: ViewStateChangeEvent) => {
        mapStore.setViewState(e.viewState);
    }, []);

    return (
        <div className={styles['map']}>
            <DeckGL
                viewState={mapStore.viewState}
                onViewStateChange={handleViewStateChange}
                controller={true}
                layers={layers}
            >
                <Map
                    reuseMaps
                    mapStyle={MAP_STYLE}
                    onMoveEnd={handleMapChange}
                    onLoad={handleMapChange}
                />
            </DeckGL>
        </div>
    );
});

export default MapView;
