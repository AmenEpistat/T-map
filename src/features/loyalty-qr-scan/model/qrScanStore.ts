import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import { loyaltyRuleApi } from '@/entities/loyalty-rule/api/loyaltyRuleApi';
import type { BusinessLoyaltyVerificationResponse } from '@/shared/api';

class QrScanStore {
    isOpen = false;
    activation = new RequestState<BusinessLoyaltyVerificationResponse>();

    constructor() {
        makeAutoObservable(this);
    }

    open = (): void => {
        this.activation.reset();
        this.isOpen = true;
    };

    close = (): void => {
        this.isOpen = false;
    };

    activate = async (qrPayload: string): Promise<void> => {
        await this.activation.execute(
            loyaltyRuleApi
                .activateRule({ qrPayload })
                .then((data) => ({ data }))
        );
    };
}

export const qrScanStore = new QrScanStore();
