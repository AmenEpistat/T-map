import { MapSearch } from '@/features/map-search';
import { MapView } from '@/widgets/map-view';
import { RotateControl, ZoomControls } from '@/features/map-controls';
import { LayerFilter } from '@/features/map-layers';

export const MapPage = () => {
    return (
        <section>
            <MapSearch />
            <MapView />
            <ZoomControls />
            <RotateControl />
            <LayerFilter />
        </section>
    );
};
