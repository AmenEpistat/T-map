import { observer } from 'mobx-react-lite';
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapLayers } from '@/widgets/map-view/hooks/useMapLayers.ts';
import { MAP_STYLE } from '@/widgets/map-view/model/constants.ts';
import { mockClusters } from '@/widgets/map-view/model/mock.ts';
import styles from './MapView.module.scss';

import type { ViewState } from '@/entities/map/model/types.ts';
import { mapStore } from '@/entities/map';

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
