import type { Promo } from '@/shared/api';

export type VenueCategory = 'food' | 'entertainment' | 'shopping';

export type VenueModerationStatus =
    | 'PENDING'
    | 'PENDING_UPDATE'
    | 'ACTIVE'
    | 'REJECTED';

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
    promotions?: Promo[];
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
    dishOfDay?: string;
    music?: string;
}

export type VenueUpdateRequest = Partial<VenueCreateRequest>;
