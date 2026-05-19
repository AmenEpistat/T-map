import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api';
import {
    type PublicVenue,
    publicVenueApi,
    type VenueQrCode,
    type VenueSearch,
} from '@/entities/public-venue';

class PublicVenueStore {
    selectedVenueIndex: string | null = null;
    venueDetail = new RequestState<PublicVenue>();
    venueSearch = new RequestState<VenueSearch[]>();
    venueQrCode = new RequestState<VenueQrCode>();

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

    async loadVenueBySearch(search: string) {
        await this.venueSearch.execute(publicVenueApi.getVenueBySearch(search));
    }

    async loadVenueQrCode(ruleId: string) {
        if (!this.selectedVenueIndex) return;

        await this.venueQrCode.execute(
            publicVenueApi.getVenueQrCode(this.selectedVenueIndex, ruleId)
        );
    }

    get isVenueSelected() {
        return this.selectedVenueIndex !== null;
    }

    clearVenueQrCode() {
        this.venueQrCode.reset();
    }
}

export const publicVenueStore = new PublicVenueStore();
