import type { VenueCategory } from './venue';
import type { PaginationType } from './pagination';

export type Loyalty = {
    id: string;
    venueId: string;
    venueName: string;
    ruleId: string;
    ruleDescription: string;
    discountApplied: number;
    verifiedAt: string;
    category: VenueCategory;
};

export interface LoyaltyRuleResponse {
    id: string;
    venueId: string;
    description: string;
    discountPercent: number;
    maxUsages: number;
    remainingUsages: number;
    active: boolean;
    createdAt: string;
}

export interface LoyaltyRuleCreateRequest {
    description: string;
    discountPercent: number;
    maxUsages: number;
}

export interface LoyaltyRuleUpdateRequest {
    description?: string;
    discountPercent?: number;
    maxUsages?: number;
    active?: boolean;
}

export interface BusinessLoyaltyVerificationResponse {
    id: string;
    venueId: string;
    userLabel: string;
    ruleId: string;
    discountApplied: number;
    verifiedAt: string;
}

export type BusinessLoyaltyVerificationPage = PaginationType & {
    items: BusinessLoyaltyVerificationResponse[];
};

export interface LoyaltyActivateRequest {
    qrPayload: string;
}
