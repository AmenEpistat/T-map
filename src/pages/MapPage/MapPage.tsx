import { LayerFilter, MapSearch, MapView, ZoomControls } from '@/features/map';

export const MapPage = () => {
    return (
        <section>
            <MapSearch />
            <MapView />
            <ZoomControls />
            <LayerFilter />
        </section>
    );
};
