import { observer } from 'mobx-react-lite';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapLayers } from '@/widgets/map-view/hooks/useMapLayers.ts';
import { MAP_STYLE } from '@/widgets/map-view/model/constants.ts';
import styles from './MapView.module.scss';
import { mapStore } from '@/entities/map';
import { useHeatmapData } from '@/widgets/map-view/hooks/useHeatmapData.ts';
import { useMapControl } from '@/widgets/map-view/hooks/useMapControl.ts';
import { useState } from 'react';
import { Splash } from '@/shared/ui';

const MapView = observer(() => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    useHeatmapData();

    const layers = useMapLayers();

    const activeLayers = isMapLoaded ? layers : [];

    const {
        mapRef,
        handleViewStateChange,
        handleInteractionStateChange,
        handleMapLoad,
    } = useMapControl();

    return (
        <div className={styles['map']}>
            {!isMapLoaded && <Splash />}
            <DeckGL
                viewState={mapStore.viewState}
                onViewStateChange={handleViewStateChange}
                onInteractionStateChange={handleInteractionStateChange}
                controller={true}
                layers={activeLayers}
            >
                <Map
                    ref={mapRef}
                    reuseMaps
                    mapStyle={MAP_STYLE}
                    onLoad={() => {
                        setTimeout(() => {
                            setIsMapLoaded(true);
                            handleMapLoad();
                        }, 300);
                    }}
                />
            </DeckGL>
        </div>
    );
});

export default MapView;
