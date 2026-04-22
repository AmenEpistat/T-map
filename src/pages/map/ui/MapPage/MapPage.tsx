import { MapSearch } from '@/features/map-search';
import { MapView } from '@/widgets/map-view';
import { ZoomControls } from '@/features/map-zoom';
import { LayerFilter } from '@/features/map-layers';

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
