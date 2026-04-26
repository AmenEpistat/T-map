import { makeAutoObservable, runInAction } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import { businessVenuesApi } from '../api/businessVenuesApi';
import type {
    OwnerVenue,
    VenueCreatePayload,
    VenueUpdatePayload,
} from './types';

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

    create = async (payload: VenueCreatePayload): Promise<OwnerVenue> => {
        const venue = await businessVenuesApi.createVenue(payload);
        runInAction(() => {
            if (this.list.data) {
                this.list.data.push(venue);
            }
        });
        return venue;
    };

    update = async (
        id: string,
        payload: VenueUpdatePayload
    ): Promise<OwnerVenue> => {
        const venue = await businessVenuesApi.updateVenue(id, payload);
        runInAction(() => {
            if (this.list.data) {
                this.list.data = this.list.data.map((v) =>
                    v.id === venue.id ? venue : v
                );
            }
            if (this.current.data?.id === venue.id) {
                this.current.data = venue;
            }
        });
        return venue;
    };

    clear = (): void => {
        this.list = new RequestState<OwnerVenue[]>();
        this.current = new RequestState<OwnerVenue>();
    };
}

export const myVenuesStore = new MyVenuesStore();
