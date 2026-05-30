import { makeAutoObservable, runInAction } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import { loyaltyRuleApi } from '../api/loyaltyRuleApi';
import type {
    LoyaltyRuleResponse,
    LoyaltyRuleCreateRequest,
    LoyaltyRuleUpdateRequest,
} from '@/shared/api';

const wrap = <T>(promise: Promise<T>): Promise<{ data: T }> =>
    promise.then((data) => ({ data }));

class LoyaltyRulesStore {
    list = new RequestState<LoyaltyRuleResponse[]>();
    current = new RequestState<LoyaltyRuleResponse>();

    constructor() {
        makeAutoObservable(this);
    }

    loadRules = async (venueId: string): Promise<void> => {
        await this.list.execute(wrap(loyaltyRuleApi.getRules(venueId)));
    };

    loadRule = async (ruleId: string): Promise<void> => {
        await this.current.execute(wrap(loyaltyRuleApi.getRule(ruleId)));
    };

    createRule = async (
        venueId: string,
        payload: LoyaltyRuleCreateRequest
    ): Promise<LoyaltyRuleResponse> => {
        const rule = await loyaltyRuleApi.createRule(venueId, payload);
        runInAction(() => {
            if (this.list.data) {
                this.list.data.push(rule);
            }
        });
        return rule;
    };

    updateRule = async (
        ruleId: string,
        payload: LoyaltyRuleUpdateRequest
    ): Promise<LoyaltyRuleResponse> => {
        const rule = await loyaltyRuleApi.updateRule(ruleId, payload);
        runInAction(() => {
            if (this.list.data) {
                this.list.data = this.list.data.map((r) =>
                    r.id === rule.id ? rule : r
                );
            }
            if (this.current.data?.id === rule.id) {
                this.current.data = rule;
            }
        });
        return rule;
    };

    clear = (): void => {
        this.list = new RequestState<LoyaltyRuleResponse[]>();
        this.current = new RequestState<LoyaltyRuleResponse>();
    };
}

export const loyaltyRulesStore = new LoyaltyRulesStore();
