import { makeAutoObservable } from 'mobx';
import { INITIAL_VIEW } from '@/widgets/map-view/model/constants.ts';
import { MAP_CATEGORIES, type MapCategory } from '@/entities/map';
import type { ClusterDataType, ViewState } from '@/entities/map/model/types.ts';

class MapStore {
    clusters: ClusterDataType[] = [];
    isLoading = false;
    viewState: ViewState = INITIAL_VIEW;

    selectedCategories: MapCategory[] = [...MAP_CATEGORIES];
    isAnomaliesVisible: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setViewState(viewState: ViewState) {
        this.viewState = viewState;
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
}

export const mapStore = new MapStore();
