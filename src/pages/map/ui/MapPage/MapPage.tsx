import { MapSearch } from '@/features/map-search';
import { RotateControl, ZoomControls } from '@/features/map-controls';
import { LayerFilter } from '@/features/map-layers';
import { ClusterPopup } from '@/features/map-cluster-popup';
import { TeamPopup } from '@/features/map-team-popup';
import { lazy, Suspense } from 'react';
import { Splash } from '@/shared/ui';

const MapView = lazy(() =>
    import('@/widgets/map-view').then((module) => ({ default: module.MapView }))
);

export const MapPage = () => {
    return (
        <section>
            <MapSearch />
            <ZoomControls />
            <RotateControl />
            <LayerFilter />
            <ClusterPopup />
            <TeamPopup />
            <Suspense fallback={<Splash />}>
                <MapView />
            </Suspense>
        </section>
    );
};
