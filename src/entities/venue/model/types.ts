export type {
    VenueCategory,
    VenueModerationStatus,
    VenuePublicResponse as PublicVenue,
    VenueOwnerResponse as OwnerVenue,
    VenueCreateRequest as VenueCreatePayload,
    VenueUpdateRequest as VenueUpdatePayload,
} from '@/shared/api/types';

export type Venue = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
};
