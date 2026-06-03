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
import iconsAnomalyPng from '@/shared/assets/iconsAnomaly.png';
import iconsCategoryJson from '@/shared/assets/iconsCategory.json';
import iconsAnomalyJson from '@/shared/assets/iconsAnomaly.json';
import { IconLayer, TextLayer } from '@deck.gl/layers';
import type { PublicVenue } from '@/entities/venue';
import {
    characterSet,
    ZOOM_ICON,
    ZOOM_TEXT,
} from '@/widgets/map-view/model/constants.ts';
import { defaultClusters } from '@/widgets/map-view/model/mock.ts';
import { publicVenueStore } from '@/entities/public-venue';
import { getIconMapping } from '@/widgets/map-view/utils/iconUtils.ts';
import { sanitizeVenueName } from '@/widgets/map-view/utils/labelUtils.ts';
import { cellToLatLng } from 'h3-js';

export const useMapLayers = () => {
    const clusters = mapStore.cachedClusters;
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

    const visibleAnomalyClusters = useMemo(() => {
        return clusters?.filter((c) => c.isAnomaly);
    }, [clusters]);

    const maxTx = useMemo(() => {
        if (!clusters || clusters.length === 0) return 0;
        return clusters.reduce((max, d) => Math.max(max, d.txCount), 0);
    }, [clusters]);

    const iconCategoryMapping = getIconMapping(iconsCategoryJson);
    const iconAnomaly = getIconMapping(iconsAnomalyJson);

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
                getLineColor: [147, 122, 219],
                getFillColor: [0, 0, 0, 0],
                extruded: false,
                pickable: true,
                autoHighlight: true,
            }),
            new IconLayer<PublicVenue>({
                id: 'poi-icons',
                data: visibleVenuesIcon,
                iconAtlas: iconsPng,
                iconMapping: iconCategoryMapping,
                getIcon: (d) => d.category,
                getSize: 30,
                getPosition: (d) => [d.lng, d.lat],
                pickable: true,
                onClick: ({ object }) => {
                    if (!object) return;
                    publicVenueStore.setSelectedVenueIndex(object.id);
                },
                updateTriggers: {
                    getIcon: [visibleVenuesIcon],
                },
                autoHighlight: true,
                highlightColor: [255, 255, 255, 100],
            }),
            new TextLayer<PublicVenue>({
                id: 'poi-labels',
                data: visibleVenuesText,
                getPosition: (d) => [d.lng, d.lat],
                getText: (d) => sanitizeVenueName(d.name),
                getSize: 14,
                getColor: (d: PublicVenue) => getNameColor(d.category),
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 'bold',
                getTextAnchor: 'middle',
                getAlignmentBaseline: 'top',
                fontSettings: {
                    sdf: true,
                    fontSize: 28,
                    buffer: 14,
                },
                outlineWidth: 2,
                outlineColor: [255, 255, 255, 255],
                characterSet: characterSet,
                onClick: ({ object }) => {
                    if (!object) return;
                    publicVenueStore.setSelectedVenueIndex(object.id);
                },
                updateTriggers: {
                    getText: [visibleVenuesText],
                },
                pickable: true,
                autoHighlight: true,
                highlightColor: [255, 255, 255, 100],
            }),

            ...(mapStore.isAnomaliesVisible
                ? [
                      new IconLayer<ClusterDataType>({
                          id: 'poi-icons-anomaly',
                          data: visibleAnomalyClusters,
                          iconAtlas: iconsAnomalyPng,
                          getIcon: () => 'anomaly',
                          iconMapping: iconAnomaly,
                          getSize: 40,
                          getPosition: (d) => {
                              const [lat, lng] = cellToLatLng(d.h3Index);
                              return [lng, lat];
                          },
                          pickable: true,
                          autoHighlight: true,
                          highlightColor: [255, 255, 255, 100],
                          onClick: ({ object }) => {
                              if (!object) return;
                              mapStore.setClusterIndex(object.h3Index);
                          },
                      }),
                  ]
                : []),

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
            visibleAnomalyClusters,
            maxTx,
            mapStore.isAnomaliesVisible,
            mapStore.isTeamVisible,
        ]
    );

    return layers;
};
