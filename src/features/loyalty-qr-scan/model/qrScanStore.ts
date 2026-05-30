import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { RequestState } from '@/shared/api/RequestState';
import { loyaltyRuleApi } from '@/entities/loyalty-rule/api/loyaltyRuleApi';
import type {
    BusinessLoyaltyVerificationResponse,
    ErrorMessage,
} from '@/shared/api';

const ACTIVATION_ERROR_MAP: Record<string, string> = {
    'Loyalty QR has already been used': 'QR-код акции уже был использован',
    'Loyalty QR is invalid': 'QR-код акции невалиден',
    'Loyalty QR is expired': 'QR-код акции истек',
    'Loyalty QR payload is missing': 'QR-код акции невалиден',
    'QR does not belong to requested venue':
        'QR-код акции принадлежит другому месту',
    'Loyalty QR payload format is invalid': 'Неверный формат QR-кода',
};

const throwActivationError = (error: unknown): never => {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
        const serverMessage = (error.response.data as { message?: string })
            .message;
        if (serverMessage && serverMessage in ACTIVATION_ERROR_MAP) {
            const mapped: ErrorMessage = {
                code: 'VALIDATION_ERROR',
                message: ACTIVATION_ERROR_MAP[serverMessage],
                status: 400,
            };
            throw mapped;
        }
    }
    throw error;
};

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
                .catch(throwActivationError)
        );
    };
}

export const qrScanStore = new QrScanStore();
