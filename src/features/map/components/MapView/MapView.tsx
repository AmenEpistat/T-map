import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './MapView.module.scss';
import { INITIAL_VIEW } from '@/features/map/model/constants.ts';

const MapView = () => {
    return (
        <div className={styles['map']}>
            <DeckGL initialViewState={INITIAL_VIEW} controller={true}>
                <Map mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' />
            </DeckGL>
        </div>
    );
};

export default MapView;
