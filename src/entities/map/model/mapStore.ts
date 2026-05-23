import { makeAutoObservable } from 'mobx';
import { INITIAL_VIEW } from '@/widgets/map-view/model/constants.ts';
import {
    ANIMATION_DURATION,
    type Bounds,
    type ClusterDetail,
    heatmapApi,
    isSameBounds,
    MAP_CATEGORIES,
    type MapCategory,
    normalizeBounds,
    type TeamMember,
} from '@/entities/map';
import type { ClusterDataType, ViewState } from '@/entities/map/model/types.ts';
import { RequestState } from '@/shared/api';
import type { PublicVenue } from '@/entities/venue';
import { FlyToInterpolator } from '@deck.gl/core';

type AnimateViewState = ViewState & {
    transitionDuration?: number;
    transitionInterpolator?: any;
};

class MapStore {
    clusters = new RequestState<{ clusters: ClusterDataType[] }>();
    bounds: Bounds | null = null;

    viewState: AnimateViewState = INITIAL_VIEW;

    selectedCategories: MapCategory[] = [...MAP_CATEGORIES];
    isAnomaliesVisible: boolean = false;

    selectedClusterIndex: string | null = null;
    clusterDetail = new RequestState<ClusterDetail>();

    venues = new RequestState<PublicVenue[]>();

    private _clusterController: AbortController | null = null;
    private _venuesController: AbortController | null = null;

    selectedTeamMember: TeamMember | null = null;
    isTeamVisible: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setBounds(nextBounds: Bounds) {
        const normalized = normalizeBounds(nextBounds);
        if (this.bounds && isSameBounds(this.bounds, normalized)) return;
        this.bounds = normalized;
    }

    setViewState(state: AnimateViewState) {
        this.viewState = state as ViewState;
    }

    setTeamMember(member: TeamMember | null) {
        this.selectedTeamMember = member;
    }

    async loadClusters() {
        if (!this.bounds) return;
        if (this.clusters.isLoading) {
            this._clusterController?.abort();
        }

        this._clusterController = new AbortController();

        await this.clusters.execute(heatmapApi.getClusters(this.bounds));
    }

    async loadClusterDetails() {
        if (!this.selectedClusterIndex) return;
        if (this.clusterDetail.isLoading) {
            this._venuesController?.abort();
        }

        this._venuesController = new AbortController();

        await this.clusterDetail.execute(
            heatmapApi.getClusterByIndex(this.selectedClusterIndex)
        );
    }

    async loadVenues() {
        if (!this.bounds) return;

        await this.venues.execute(
            heatmapApi.getVenues(this.bounds, this.selectedCategories)
        );
    }

    zoomIn() {
        this.viewState = {
            ...this.viewState,
            zoom: Math.min(this.viewState.zoom + 1, 18),
        };
    }

    zoomOut() {
        this.viewState = {
            ...this.viewState,
            zoom: Math.max(this.viewState.zoom - 1, 5),
        };
    }

    toggleCategory(key: MapCategory) {
        if (this.selectedCategories.includes(key)) {
            this.selectedCategories = this.selectedCategories.filter(
                (c) => c !== key
            );
        } else {
            this.selectedCategories.push(key);
        }
    }

    toggleAnomalies() {
        this.isAnomaliesVisible = !this.isAnomaliesVisible;
    }

    toggleTeam = () => {
        this.isTeamVisible = !this.isTeamVisible;
    };

    setPitch(pitch: number) {
        this.viewState = {
            ...this.viewState,
            pitch,
            transitionDuration: ANIMATION_DURATION,
            transitionInterpolator: new FlyToInterpolator(),
        };
    }

    setClusterIndex(h3Index: string | null) {
        this.selectedClusterIndex = h3Index;
    }

    get isClusterSelected() {
        return this.selectedClusterIndex !== null;
    }

    get mode3D() {
        return mapStore.viewState.pitch === 0;
    }
}

export const mapStore = new MapStore();
