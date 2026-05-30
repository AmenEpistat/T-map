import type { VenueCategory } from '@/shared/api';

export type { VenuePublicResponse as PublicVenue } from '@/shared/api/types';

export type VenueSearch = {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    category: VenueCategory;
    address: string;
};

export type VenueQrCode = {
    venueId: string;
    ruleId: string;
    qrPayload: string;
    expiresAt: string;
};
