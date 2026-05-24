import { apiClient } from '@/shared/api/client';
import type {
    LoyaltyRuleResponse,
    LoyaltyRuleCreateRequest,
    LoyaltyRuleUpdateRequest,
    LoyaltyActivateRequest,
    BusinessLoyaltyVerificationPage,
    BusinessLoyaltyVerificationResponse,
} from '@/shared/api';

const VENUE_BASE = '/business/venues';
const RULE_BASE = '/business/loyalty-rules';

export const loyaltyRuleApi = {
    getRules: async (venueId: string): Promise<LoyaltyRuleResponse[]> => {
        const { data } = await apiClient.get<LoyaltyRuleResponse[]>(
            `${VENUE_BASE}/${venueId}/loyalty-rules`
        );
        return data;
    },

    createRule: async (
        venueId: string,
        payload: LoyaltyRuleCreateRequest
    ): Promise<LoyaltyRuleResponse> => {
        const { data } = await apiClient.post<LoyaltyRuleResponse>(
            `${VENUE_BASE}/${venueId}/loyalty-rules`,
            payload
        );
        return data;
    },

    getRule: async (ruleId: string): Promise<LoyaltyRuleResponse> => {
        const { data } = await apiClient.get<LoyaltyRuleResponse>(
            `${RULE_BASE}/${ruleId}`
        );
        return data;
    },

    updateRule: async (
        ruleId: string,
        payload: LoyaltyRuleUpdateRequest
    ): Promise<LoyaltyRuleResponse> => {
        const { data } = await apiClient.patch<LoyaltyRuleResponse>(
            `${RULE_BASE}/${ruleId}`,
            payload
        );
        return data;
    },

    getRuleHistory: async (
        ruleId: string,
        page: number,
        size: number
    ): Promise<BusinessLoyaltyVerificationPage> => {
        const { data } = await apiClient.get<BusinessLoyaltyVerificationPage>(
            `${RULE_BASE}/${ruleId}/history`,
            { params: { page, size } }
        );
        return data;
    },

    activateRule: async (
        payload: LoyaltyActivateRequest
    ): Promise<BusinessLoyaltyVerificationResponse> => {
        const { data } =
            await apiClient.post<BusinessLoyaltyVerificationResponse>(
                `${RULE_BASE}/activate`,
                payload
            );
        return data;
    },
};
