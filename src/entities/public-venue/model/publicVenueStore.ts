import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api';
import { type PublicVenue, publicVenueApi } from '@/entities/public-venue';

class PublicVenueStore {
    selectedVenueIndex: string | null = null;
    venueDetail = new RequestState<PublicVenue>();

    constructor() {
        makeAutoObservable(this);
    }

    setSelectedVenueIndex(id: string | null) {
        this.selectedVenueIndex = id;
    }

    async loadVenueDetails() {
        if (!this.selectedVenueIndex) return;

        await this.venueDetail.execute(
            publicVenueApi.getVenueById(this.selectedVenueIndex)
        );
    }

    get isVenueSelected() {
        return this.selectedVenueIndex !== null;
    }
}

export const publicVenueStore = new PublicVenueStore();
