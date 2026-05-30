import type { VenueCategory, VenueModerationStatus } from './venue';
import type { UserRole } from './auth';

export interface AdminVenueModeration {
    id: string;
    ownerId: string;
    ownerEmail: string;
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

export interface AdminUserModeration {
    id: string;
    email: string;
    nickname: string;
    role: UserRole;
    blocked: boolean;
    createdAt: string;
}

export interface AdminUserModerationPage {
    items: AdminUserModeration[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
}

export interface AdminUsersSearchParams {
    nickname?: string;
    email?: string;
    role?: UserRole;
    blocked?: boolean;
    createdFrom?: string;
    createdTo?: string;
    page?: number;
    size?: number;
}

export interface AdminModerationDecision {
    reason?: string;
}
