import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './MapView.module.scss';
import { INITIAL_VIEW, MAP_STYLE } from '@/features/map/model/constants.ts';

const MapView = () => {
    return (
        <div className={styles['map']}>
            <DeckGL initialViewState={INITIAL_VIEW} controller={true}>
                <Map mapStyle={MAP_STYLE} />
            </DeckGL>
        </div>
    );
};

export default MapView;
