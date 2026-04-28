import { makeAutoObservable } from 'mobx';
import { INITIAL_VIEW } from '@/widgets/map-view/model/constants.ts';
import {
    type Bounds,
    type ClusterDetail,
    heatmapApi,
    isSameBounds,
    MAP_CATEGORIES,
    type MapCategory,
    normalizeBounds,
} from '@/entities/map';
import type { ClusterDataType, ViewState } from '@/entities/map/model/types.ts';
import { RequestState } from '@/shared/api';

class MapStore {
    clusters = new RequestState<{ clusters: ClusterDataType[] }>();
    bounds: Bounds | null = null;

    viewState: ViewState = INITIAL_VIEW;

    selectedCategories: MapCategory[] = [...MAP_CATEGORIES];
    isAnomaliesVisible: boolean = false;

    selectedClusterIndex: string | null = null;
    clusterDetail = new RequestState<ClusterDetail>();

    constructor() {
        makeAutoObservable(this);
    }

    setBounds(nextBounds: Bounds) {
        const normalized = normalizeBounds(nextBounds);
        if (this.bounds && isSameBounds(this.bounds, normalized)) return;
        this.bounds = normalized;
    }

    setViewState(viewState: ViewState) {
        this.viewState = viewState;
    }

    async loadClusters() {
        if (!this.bounds || this.clusters.isLoading) return;

        await this.clusters.execute(
            heatmapApi.getClusters(this.bounds, this.selectedCategories)
        );
    }

    async loadClusterDetails() {
        if (!this.selectedClusterIndex) return;

        await this.clusterDetail.execute(
            heatmapApi.getClusterByIndex(this.selectedClusterIndex)
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

    setClusterIndex(h3Index: string | null) {
        this.selectedClusterIndex = h3Index;
    }

    get isClusterSelected() {
        return this.selectedClusterIndex !== null;
    }
}

export const mapStore = new MapStore();
