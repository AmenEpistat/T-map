import { useMemo } from 'react';
import { H3HexagonLayer } from '@deck.gl/geo-layers';
import {
    getBorderColor,
    getClusterColor,
    getNameColor,
} from '@/widgets/map-view/utils/colorUtils.ts';
import type { ClusterDataType } from '@/entities/map/model/types.ts';
import { mapStore, type TeamMember, teamMembers } from '@/entities/map';
import iconsPng from '@/shared/assets/icons.png';
import iconsJson from '@/shared/assets/icons.json';
import { IconLayer, TextLayer } from '@deck.gl/layers';
import type { PublicVenue } from '@/entities/venue';
import {
    characterSet,
    ZOOM_ICON,
    ZOOM_TEXT,
} from '@/widgets/map-view/model/constants.ts';
import { defaultClusters } from '@/widgets/map-view/model/mock.ts';

export const useMapLayers = () => {
    const clusters = mapStore.clusters.data?.clusters;
    const venues = mapStore.venues.data || [];

    const currentZoom = mapStore.viewState.zoom;

    const visibleVenuesIcon = useMemo(() => {
        if (currentZoom < ZOOM_ICON) return [];
        return venues;
    }, [venues, currentZoom]);

    const visibleVenuesText = useMemo(() => {
        if (currentZoom < ZOOM_TEXT) return [];
        return venues;
    }, [venues, currentZoom]);

    const visibleClusters = useMemo(() => {
        if (currentZoom > ZOOM_ICON) return [];
        return clusters;
    }, [clusters, currentZoom]);

    const visibleDefaultClusters = useMemo(() => {
        if (currentZoom > ZOOM_ICON) return [];
        return defaultClusters;
    }, [currentZoom]);

    const maxTx = useMemo(() => {
        if (!clusters || clusters.length === 0) return 0;
        return clusters.reduce((max, d) => Math.max(max, d.txCount), 0);
    }, [clusters]);

    const iconMapping = iconsJson.frames.reduce(
        (acc, value) => {
            const cleanKey = value.filename.replace('.svg', '');
            acc[cleanKey] = {
                x: value.frame.x,
                y: value.frame.y,
                width: value.frame.w,
                height: value.frame.h,
                anchorY: value.frame.h,
                anchorX: value.frame,
            };

            return acc;
        },
        {} as Record<string, any>
    );

    const layers = useMemo(
        () => [
            new H3HexagonLayer<ClusterDataType>({
                id: 'h3-hexagon-layer',
                data: visibleClusters,
                getHexagon: (d) => d.h3Index,
                elevationScale: 0,
                stroked: true,
                extruded: false,
                getLineWidth: 3,
                coverage: 0.955,
                getLineColor: (d) => getBorderColor(d.txCount, maxTx),
                getFillColor: (d) => getClusterColor(d.txCount, maxTx),
                pickable: true,
                autoHighlight: true,
                highlightColor: [255, 255, 255, 100],
                updateTriggers: {
                    getFillColor: [maxTx],
                    getLineColor: [maxTx],
                },
                onClick: ({ object }) => {
                    if (!object) return;
                    mapStore.setClusterIndex(object.h3Index);
                },
            }),
            new H3HexagonLayer({
                id: 'h3-hexagon-layer-default',
                data: visibleDefaultClusters,
                getHexagon: (d) => d.h3Index,
                elevationScale: 0,
                stroked: true,
                getLineWidth: 3,
                coverage: 0.955,
                getLineColor: [24, 124, 56],
                getFillColor: [0, 0, 0, 0],
                extruded: false,
                pickable: true,
                autoHighlight: true,
            }),
            new IconLayer<PublicVenue>({
                id: 'poi-icons',
                data: visibleVenuesIcon,
                iconAtlas: iconsPng,
                iconMapping: iconMapping,
                getIcon: (d) => d.category,
                getSize: 40,
                getPosition: (d) => [d.lng, d.lat],
                pickable: true,
            }),
            new TextLayer<PublicVenue>({
                id: 'poi-labels',
                data: visibleVenuesText,
                getPosition: (d) => [d.lng, d.lat],
                getText: (d) => d.name,
                getSize: 14,
                getColor: (d: PublicVenue) => getNameColor(d.category),
                fontFamily: 'Inter, sans-serif',
                fontWeight: 'bold',
                getPixelOffset: [10, -50],
                characterSet: characterSet,
            }),

            ...(mapStore.isTeamVisible
                ? [
                      new IconLayer<TeamMember>({
                          id: 'team-avatars-layer',
                          data: teamMembers,
                          getIcon: (d) => ({
                              url: d.avatarUrl,
                              width: 128,
                              height: 128,
                              anchorX: 64,
                              anchorY: 128,
                              mask: false,
                          }),
                          getPosition: (d) => [d.lng, d.lat],
                          getSize: 45,
                          pickable: true,
                          onClick: ({ object }) => {
                              if (!object) return;
                              mapStore.setTeamMember(object);
                          },
                      }),
                  ]
                : []),
        ],
        [
            visibleClusters,
            visibleVenuesText,
            visibleVenuesIcon,
            visibleDefaultClusters,
            maxTx,
        ]
    );

    return layers;
};
