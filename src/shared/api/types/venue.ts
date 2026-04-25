export type VenueCategory = 'food' | 'entertainment' | 'shopping';

export type VenueModerationStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface VenuePromoResponse {
    id: string;
    venueId: string;
    title: string;
    description?: string;
    startsAt: string;
    endsAt: string;
    createdAt: string;
}

export interface VenuePublicResponse {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    description?: string;
    category: VenueCategory;
    photoUrl?: string;
    dishOfDay?: string;
    music?: string;
    peopleNow?: number;
    createdAt: string;
    updatedAt: string;
    promotions?: VenuePromoResponse[];
}

export interface VenueOwnerResponse extends VenuePublicResponse {
    ownerId: string;
    h3Res9: string;
    moderationStatus: VenueModerationStatus;
    rejectReason?: string;
}

export interface VenueCreateRequest {
    name: string;
    address: string;
    lat: number;
    lng: number;
    category: VenueCategory;
    description?: string;
    photoUrl?: string;
    dishOfDay?: string;
    music?: string;
}

export interface VenueUpdateRequest {
    name?: string;
    address?: string;
    description?: string;
    lat?: number;
    lng?: number;
    category?: VenueCategory;
    photoUrl?: string;
    dishOfDay?: string;
    music?: string;
}
