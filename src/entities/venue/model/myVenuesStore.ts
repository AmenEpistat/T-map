import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import { businessVenuesApi } from '@/entities/venue';
import type { OwnerVenue } from './types';

const wrap = <T>(promise: Promise<T>): Promise<{ data: T }> =>
    promise.then((data) => ({ data }));

class MyVenuesStore {
    list = new RequestState<OwnerVenue[]>();
    current = new RequestState<OwnerVenue>();

    constructor() {
        makeAutoObservable(this);
    }

    loadAll = async (): Promise<void> => {
        await this.list.execute(wrap(businessVenuesApi.getMyVenues()));
    };

    loadById = async (id: string): Promise<void> => {
        await this.current.execute(wrap(businessVenuesApi.getMyVenueById(id)));
    };

    clear = (): void => {
        this.list = new RequestState<OwnerVenue[]>();
        this.current = new RequestState<OwnerVenue>();
    };
}

export const myVenuesStore = new MyVenuesStore();
