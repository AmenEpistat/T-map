import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import type { OwnerVenue } from './types';

class MyVenuesStore {
    list = new RequestState<OwnerVenue[]>();
    current = new RequestState<OwnerVenue>();

    constructor() {
        makeAutoObservable(this);
    }

    clear = (): void => {
        this.list = new RequestState<OwnerVenue[]>();
        this.current = new RequestState<OwnerVenue>();
    };
}

export const myVenuesStore = new MyVenuesStore();
