import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { loyaltyRulesStore } from '@/entities/loyalty-rule';

export interface LoyaltyRuleCreateFormValues {
    description: string;
    discountPercent: number;
    maxUsages: number;
}

export const useLoyaltyRuleCreate = (venueId: string) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (
        values: LoyaltyRuleCreateFormValues
    ): Promise<void> => {
        setIsSubmitting(true);
        try {
            await loyaltyRulesStore.createRule(venueId, values);
            notification.success({
                message: 'Акция создана',
                placement: 'topRight',
            });
            navigate(`/business/${venueId}/loyalty`);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось создать акцию';
            notification.error({
                message: 'Ошибка',
                description: message,
                placement: 'topRight',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submit, isSubmitting };
};
