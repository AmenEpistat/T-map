import { http, HttpResponse, delay } from 'msw';
import type { HttpHandler } from 'msw';
import type {
    AdminModerationDecision,
    AdminVenueModeration,
    AdminVenueModerationPage,
    ErrorResponse,
    VenueModerationStatus,
    VenueOwnerResponse,
} from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { mockDb } from '../db';
import { err, requireAdminAuth } from './utils';

const BASE = env.API_BASE_URL;

const LATENCY_MS = 300;

type IdParam = { id: string };
type ListResponse = AdminVenueModerationPage | ErrorResponse;
type ItemResponse = AdminVenueModeration | ErrorResponse;

const toAdminVenue = (venue: VenueOwnerResponse): AdminVenueModeration => ({
    id: venue.id,
    ownerId: venue.ownerId,
    name: venue.name,
    address: venue.address,
    lat: venue.lat,
    lng: venue.lng,
    h3Res9: venue.h3Res9,
    category: venue.category,
    photoUrl: venue.photoUrl,
    dishOfDay: venue.dishOfDay,
    music: venue.music,
    moderationStatus: venue.moderationStatus,
    rejectReason: venue.rejectReason,
    createdAt: venue.createdAt,
    updatedAt: venue.updatedAt,
});

const paginate = (
    items: AdminVenueModeration[],
    page: number,
    size: number
): AdminVenueModerationPage => {
    const start = page * size;
    const slice = items.slice(start, start + size);
    return {
        items: slice,
        page,
        size,
        totalElements: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / size)),
    };
};

const isModerationStatus = (
    value: string | null
): value is VenueModerationStatus =>
    value === 'PENDING' ||
    value === 'PENDING_UPDATE' ||
    value === 'ACTIVE' ||
    value === 'REJECTED';

const getModerationQueue = http.get<never, never, ListResponse>(
    `${BASE}/admin/venues`,
    async ({ request }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const url = new URL(request.url);
        const statusParam = url.searchParams.get('status');
        const pageParam = url.searchParams.get('page');
        const sizeParam = url.searchParams.get('size');

        const page = pageParam ? Math.max(0, Number(pageParam)) : 0;
        const size = sizeParam
            ? Math.min(100, Math.max(1, Number(sizeParam)))
            : 20;

        let filtered = mockDb.venues.map(toAdminVenue);
        if (statusParam && isModerationStatus(statusParam)) {
            filtered = filtered.filter(
                (v) => v.moderationStatus === statusParam
            );
        }

        return HttpResponse.json<AdminVenueModerationPage>(
            paginate(filtered, page, size),
            { status: 200 }
        );
    }
);

const getVenueById = http.get<IdParam, never, ItemResponse>(
    `${BASE}/admin/venues/:id`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const venue = mockDb.venues.find((v) => v.id === params.id);
        if (!venue) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        return HttpResponse.json<AdminVenueModeration>(toAdminVenue(venue), {
            status: 200,
        });
    }
);

const verifyVenue = http.patch<IdParam, never, ItemResponse>(
    `${BASE}/admin/venues/:id/verify`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const index = mockDb.venues.findIndex((v) => v.id === params.id);
        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        const existing = mockDb.venues[index];

        if (
            existing.moderationStatus !== 'PENDING' &&
            existing.moderationStatus !== 'PENDING_UPDATE'
        ) {
            return err(
                'CONFLICT',
                `Cannot verify venue in status ${existing.moderationStatus}.`,
                409
            );
        }

        const updated: VenueOwnerResponse = {
            ...existing,
            moderationStatus: 'ACTIVE',
            rejectReason: undefined,
            updatedAt: new Date().toISOString(),
        };

        mockDb.venues[index] = updated;

        return HttpResponse.json<AdminVenueModeration>(toAdminVenue(updated), {
            status: 200,
        });
    }
);

const rejectVenue = http.patch<IdParam, AdminModerationDecision, ItemResponse>(
    `${BASE}/admin/venues/:id/reject`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const auth = requireAdminAuth(request);
        if (auth.error) return auth.error;

        const index = mockDb.venues.findIndex((v) => v.id === params.id);
        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        const existing = mockDb.venues[index];

        if (
            existing.moderationStatus !== 'PENDING' &&
            existing.moderationStatus !== 'PENDING_UPDATE'
        ) {
            return err(
                'CONFLICT',
                `Cannot reject venue in status ${existing.moderationStatus}.`,
                409
            );
        }

        let decision: AdminModerationDecision = {};
        try {
            decision = await request.json();
        } catch {
            decision = {};
        }

        if (decision.reason && decision.reason.length > 1000) {
            return err(
                'VALIDATION_FAILED',
                'Reject reason exceeds 1000 characters.',
                400
            );
        }

        const updated: VenueOwnerResponse = {
            ...existing,
            moderationStatus: 'REJECTED',
            rejectReason: decision.reason,
            updatedAt: new Date().toISOString(),
        };

        mockDb.venues[index] = updated;

        return HttpResponse.json<AdminVenueModeration>(toAdminVenue(updated), {
            status: 200,
        });
    }
);

export const adminVenuesHandlers: HttpHandler[] = [
    getModerationQueue,
    getVenueById,
    verifyVenue,
    rejectVenue,
];
