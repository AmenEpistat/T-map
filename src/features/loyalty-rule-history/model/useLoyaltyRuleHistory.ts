import { useState, useEffect } from 'react';
import { message } from 'antd';
import { loyaltyRuleApi } from '@/entities/loyalty-rule';
import type { BusinessLoyaltyVerificationPage } from '@/shared/api';

const PAGE_SIZE = 10;

export const useLoyaltyRuleHistory = (ruleId: string | null) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<BusinessLoyaltyVerificationPage | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setPage(0);
        setData(null);
    }, [ruleId]);

    useEffect(() => {
        if (!ruleId) return;

        let cancelled = false;
        setIsLoading(true);

        loyaltyRuleApi
            .getRuleHistory(ruleId, page, PAGE_SIZE)
            .then((result) => {
                if (!cancelled) setData(result);
            })
            .catch(() => {
                if (!cancelled)
                    void message.error(
                        'Не удалось загрузить историю применений'
                    );
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [ruleId, page]);

    return { data, isLoading, page, setPage, pageSize: PAGE_SIZE };
};
