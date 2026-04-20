import { makeAutoObservable } from 'mobx';
import type { ClusterDataType, ViewState } from './types';
import { INITIAL_VIEW } from '@/features/map/model/constants.ts';

class MapStore {
    clusters: ClusterDataType[] = [];
    isLoading = false;
    viewState: ViewState = INITIAL_VIEW;

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
}

export const mapStore = new MapStore();
