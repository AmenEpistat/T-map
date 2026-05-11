import type { VenueCategory, VenueModerationStatus } from './venue';

export interface AdminVenueModeration {
    id: string;
    ownerId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    h3Res9: string;
    category: VenueCategory;
    photoUrl?: string;
    dishOfDay?: string;
    music?: string;
    moderationStatus: VenueModerationStatus;
    rejectReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminVenueModerationPage {
    items: AdminVenueModeration[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
}

export interface AdminVenuesListParams {
    status?: VenueModerationStatus;
    page?: number;
    size?: number;
}

export interface AdminModerationDecision {
    reason?: string;
}
