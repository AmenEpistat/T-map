import { observer } from 'mobx-react-lite';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStore } from '@/features/map/model/mapStore';
import { useMapLayers } from '@/features/map/hooks/useMapLayers';
import { MAP_STYLE } from '@/features/map/model/constants';
import { mockClusters } from '@/features/map/model/mock';
import styles from './MapView.module.scss';
import type { ViewState } from '@/features/map/model/types.ts';

const MapView = observer(() => {
    const layers = useMapLayers(mockClusters);

    return (
        <div className={styles['map']}>
            <DeckGL
                viewState={mapStore.viewState}
                onViewStateChange={(e) =>
                    mapStore.setViewState(e.viewState as ViewState)
                }
                controller={true}
                layers={layers}
            >
                <Map mapStyle={MAP_STYLE} />
            </DeckGL>
        </div>
    );
});

export default MapView;
