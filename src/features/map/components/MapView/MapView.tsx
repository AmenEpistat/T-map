import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { INITIAL_VIEW, MAP_STYLE } from '@/features/map/model/constants.ts';
import { mockClusters } from '@/features/map/model/mock.ts';
import { useMapLayers } from '@/features/map/hooks/useMapLayers.ts';
import styles from './MapView.module.scss';

const MapView = () => {
    const layers = useMapLayers(mockClusters);

    return (
        <div className={styles['map']}>
            <DeckGL
                initialViewState={INITIAL_VIEW}
                controller={true}
                layers={layers}
            >
                <Map mapStyle={MAP_STYLE} />
            </DeckGL>
        </div>
    );
};

export default MapView;