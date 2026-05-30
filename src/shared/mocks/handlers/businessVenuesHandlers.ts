import { http, HttpResponse, delay } from 'msw';
import type { HttpHandler } from 'msw';
import type {
    ErrorResponse,
    VenueCreateRequest,
    VenueOwnerResponse,
    VenueUpdateRequest,
} from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { mockDb } from '../db';

const BASE = env.API_BASE_URL;

const LATENCY_MS = 300;

const SEED_OWNER_ID = '00000000-0000-0000-0000-000000000001';

type IdParam = { id: string };
type ListResponse = VenueOwnerResponse[] | ErrorResponse;
type ItemResponse = VenueOwnerResponse | ErrorResponse;
type DeleteResponse = undefined | ErrorResponse;

const generateId = () => crypto.randomUUID();
const getNextPhotoModerationStatus = (
    status: VenueOwnerResponse['moderationStatus']
): VenueOwnerResponse['moderationStatus'] =>
    status === 'ACTIVE' ? 'PENDING_UPDATE' : status;

const err = (code: string, message: string, status: number) =>
    HttpResponse.json<ErrorResponse>({ code, message }, { status });

const requireAuth = (request: Request): ErrorResponse | null => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { code: 'UNAUTHORIZED', message: 'Access token is missing.' };
    }
    const token = authHeader.slice('Bearer '.length);
    if (token.startsWith('expired.')) {
        return { code: 'UNAUTHORIZED', message: 'Access token has expired.' };
    }
    return null;
};

const getMyVenues = http.get<never, never, ListResponse>(
    `${BASE}/business/venues`,
    async ({ request }) => {
        await delay(LATENCY_MS);

        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        return HttpResponse.json<VenueOwnerResponse[]>(mockDb.venues, {
            status: 200,
        });
    }
);

const getMyVenueById = http.get<IdParam, never, ItemResponse>(
    `${BASE}/business/venues/:id`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        const venue = mockDb.venues.find((v) => v.id === params.id);
        if (!venue) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        return HttpResponse.json<VenueOwnerResponse>(venue, { status: 200 });
    }
);

const createVenue = http.post<never, VenueCreateRequest, ItemResponse>(
    `${BASE}/business/venues`,
    async ({ request }) => {
        await delay(LATENCY_MS);

        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        const body = await request.json();

        const required: Array<keyof VenueCreateRequest> = [
            'name',
            'address',
            'lat',
            'lng',
            'category',
        ];
        for (const field of required) {
            if (body[field] === undefined || body[field] === null) {
                return err(
                    'VALIDATION_FAILED',
                    `Field '${String(field)}' is required.`,
                    400
                );
            }
        }

        const now = new Date().toISOString();
        const venue: VenueOwnerResponse = {
            id: generateId(),
            ownerId: SEED_OWNER_ID,
            name: body.name,
            address: body.address,
            lat: body.lat,
            lng: body.lng,
            category: body.category,
            description: body.description,
            dishOfDay: body.dishOfDay,
            music: body.music,
            h3Res9: 'mock-h3-index',
            moderationStatus: 'PENDING',
            createdAt: now,
            updatedAt: now,
        };
        mockDb.venues.push(venue);

        return HttpResponse.json<VenueOwnerResponse>(venue, { status: 201 });
    }
);

const updateVenue = http.put<IdParam, VenueUpdateRequest, ItemResponse>(
    `${BASE}/business/venues/:id`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        const index = mockDb.venues.findIndex((v) => v.id === params.id);
        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        const body = await request.json();
        const existing = mockDb.venues[index];

        const nextModerationStatus =
            existing.moderationStatus === 'ACTIVE'
                ? 'PENDING_UPDATE'
                : existing.moderationStatus === 'REJECTED'
                  ? 'PENDING'
                  : existing.moderationStatus;

        const updated: VenueOwnerResponse = {
            ...existing,
            ...body,
            moderationStatus: nextModerationStatus,
            updatedAt: new Date().toISOString(),
        };

        mockDb.venues[index] = updated;

        return HttpResponse.json<VenueOwnerResponse>(updated, { status: 200 });
    }
);

const uploadVenuePhoto = http.post<IdParam, never, ItemResponse>(
    `${BASE}/business/venues/:id/photo`,
    async ({ request, params }) => {
        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        const formData = await request.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return err('VALIDATION_FAILED', 'Файл не найден в запросе', 400);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return err(
                'VALIDATION_FAILED',
                'Неподдерживаемый формат. Разрешены: JPEG, PNG, WEBP',
                400
            );
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return err(
                'VALIDATION_FAILED',
                'Файл слишком большой. Максимум 10 МБ',
                400
            );
        }

        const index = mockDb.venues.findIndex((v) => v.id === params.id);
        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        await delay(500);

        const existing = mockDb.venues[index];
        const updated: VenueOwnerResponse = {
            ...existing,
            photoUrl: `https://placehold.co/600x400?text=Uploaded&r=${Date.now()}`,
            moderationStatus: getNextPhotoModerationStatus(
                existing.moderationStatus
            ),
            updatedAt: new Date().toISOString(),
        };

        mockDb.venues[index] = updated;

        return HttpResponse.json<VenueOwnerResponse>(updated, { status: 200 });
    }
);

const deleteVenuePhoto = http.delete<IdParam, never, ItemResponse>(
    `${BASE}/business/venues/:id/photo`,
    async ({ request, params }) => {
        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        const index = mockDb.venues.findIndex((v) => v.id === params.id);
        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        await delay(LATENCY_MS);

        const existing = mockDb.venues[index];
        const updated: VenueOwnerResponse = {
            ...existing,
            photoUrl: undefined,
            moderationStatus: getNextPhotoModerationStatus(
                existing.moderationStatus
            ),
            updatedAt: new Date().toISOString(),
        };

        mockDb.venues[index] = updated;

        return HttpResponse.json<VenueOwnerResponse>(updated, { status: 200 });
    }
);

const deleteVenue = http.delete<IdParam, never, DeleteResponse>(
    `${BASE}/business/venues/:id`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireAuth(request);
        if (authError) return err(authError.code, authError.message, 401);

        const index = mockDb.venues.findIndex((v) => v.id === params.id);
        if (index === -1) {
            return err(
                'NOT_FOUND',
                `Requested venue with ID ${params.id} was not found.`,
                404
            );
        }

        mockDb.venues.splice(index, 1);
        return new HttpResponse(null, { status: 204 });
    }
);

export const businessVenuesHandlers: HttpHandler[] = [
    getMyVenues,
    getMyVenueById,
    createVenue,
    updateVenue,
    uploadVenuePhoto,
    deleteVenuePhoto,
    deleteVenue,
];
