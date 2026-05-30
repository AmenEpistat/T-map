import { useState } from 'react';
import { notification } from 'antd';
import { loyaltyRulesStore } from '@/entities/loyalty-rule';
import type { LoyaltyRuleResponse } from '@/shared/api';

export interface LoyaltyRuleEditFormValues {
    description: string;
    discountPercent: number;
    maxUsages: number;
    active: boolean;
}

const hasRuleEditChanges = (
    rule: LoyaltyRuleResponse,
    values: LoyaltyRuleEditFormValues
): boolean =>
    values.description !== rule.description ||
    values.discountPercent !== rule.discountPercent ||
    values.maxUsages !== rule.maxUsages ||
    values.active !== rule.active;

export const useLoyaltyRuleEdit = (rule: LoyaltyRuleResponse) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (values: LoyaltyRuleEditFormValues): Promise<void> => {
        if (!hasRuleEditChanges(rule, values)) {
            notification.info({
                message: 'Нет изменений для сохранения',
                placement: 'topRight',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await loyaltyRulesStore.updateRule(rule.id, values);
            notification.success({
                message: 'Акция обновлена',
                placement: 'topRight',
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось сохранить изменения';
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
