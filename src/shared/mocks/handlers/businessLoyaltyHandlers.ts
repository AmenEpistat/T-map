import { http, HttpResponse, delay } from 'msw';
import type { HttpHandler } from 'msw';
import type {
    LoyaltyRuleResponse,
    LoyaltyRuleCreateRequest,
    LoyaltyRuleUpdateRequest,
    BusinessLoyaltyVerificationPage,
} from '@/shared/api/types';
import { env } from '@/shared/config/env';
import { mockDb } from '../db';
import { err, getUserFromToken } from './utils';

const BASE = env.API_BASE_URL;
const LATENCY_MS = 300;

type VenueIdParam = { id: string };
type RuleIdParam = { id: string };

const requireOwnerAuth = (request: Request) => {
    const user = getUserFromToken(request);
    if (!user)
        return err('UNAUTHORIZED', 'Access token is missing or invalid.', 401);
    if (user.role !== 'BUSINESS_OWNER')
        return err('FORBIDDEN', 'Business owner role is required.', 403);
    return null;
};

const getLoyaltyRules = http.get<VenueIdParam>(
    `${BASE}/business/venues/:id/loyalty-rules`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireOwnerAuth(request);
        if (authError) return authError;

        const venue = mockDb.venues.find((v) => v.id === params.id);
        if (!venue)
            return err(
                'NOT_FOUND',
                `Venue with ID ${params.id} was not found.`,
                404
            );

        const rules = mockDb.loyaltyRules.filter(
            (r) => r.venueId === params.id
        );
        return HttpResponse.json<LoyaltyRuleResponse[]>(rules, { status: 200 });
    }
);

const createLoyaltyRule = http.post<VenueIdParam, LoyaltyRuleCreateRequest>(
    `${BASE}/business/venues/:id/loyalty-rules`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireOwnerAuth(request);
        if (authError) return authError;

        const venue = mockDb.venues.find((v) => v.id === params.id);
        if (!venue)
            return err(
                'NOT_FOUND',
                `Venue with ID ${params.id} was not found.`,
                404
            );

        const body = await request.json();

        const rule: LoyaltyRuleResponse = {
            id: crypto.randomUUID(),
            venueId: params.id,
            description: body.description,
            discountPercent: body.discountPercent,
            maxUsages: body.maxUsages,
            remainingUsages: body.maxUsages,
            active: true,
            createdAt: new Date().toISOString(),
        };
        mockDb.loyaltyRules.push(rule);

        return HttpResponse.json<LoyaltyRuleResponse>(rule, { status: 201 });
    }
);

const getLoyaltyRuleById = http.get<RuleIdParam>(
    `${BASE}/business/loyalty-rules/:id`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireOwnerAuth(request);
        if (authError) return authError;

        const rule = mockDb.loyaltyRules.find((r) => r.id === params.id);
        if (!rule)
            return err(
                'NOT_FOUND',
                `Loyalty rule with ID ${params.id} was not found.`,
                404
            );

        return HttpResponse.json<LoyaltyRuleResponse>(rule, { status: 200 });
    }
);

const updateLoyaltyRule = http.patch<RuleIdParam, LoyaltyRuleUpdateRequest>(
    `${BASE}/business/loyalty-rules/:id`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireOwnerAuth(request);
        if (authError) return authError;

        const index = mockDb.loyaltyRules.findIndex((r) => r.id === params.id);
        if (index === -1)
            return err(
                'NOT_FOUND',
                `Loyalty rule with ID ${params.id} was not found.`,
                404
            );

        const body = await request.json();
        const existing = mockDb.loyaltyRules[index];

        const updated: LoyaltyRuleResponse = { ...existing, ...body };
        mockDb.loyaltyRules[index] = updated;

        return HttpResponse.json<LoyaltyRuleResponse>(updated, { status: 200 });
    }
);

const getLoyaltyRuleHistory = http.get<RuleIdParam>(
    `${BASE}/business/loyalty-rules/:id/history`,
    async ({ request, params }) => {
        await delay(LATENCY_MS);

        const authError = requireOwnerAuth(request);
        if (authError) return authError;

        const rule = mockDb.loyaltyRules.find((r) => r.id === params.id);
        if (!rule)
            return err(
                'NOT_FOUND',
                `Loyalty rule with ID ${params.id} was not found.`,
                404
            );

        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? '0');
        const size = Number(url.searchParams.get('size') ?? '20');

        const allItems = mockDb.loyaltyVerifications.filter(
            (v) => v.ruleId === params.id
        );
        const items = allItems.slice(page * size, page * size + size);

        return HttpResponse.json<BusinessLoyaltyVerificationPage>(
            {
                items,
                page,
                size,
                totalPages: Math.ceil(allItems.length / size),
                totalElements: allItems.length,
            },
            { status: 200 }
        );
    }
);

export const businessLoyaltyHandlers: HttpHandler[] = [
    getLoyaltyRules,
    createLoyaltyRule,
    getLoyaltyRuleById,
    updateLoyaltyRule,
    getLoyaltyRuleHistory,
];
