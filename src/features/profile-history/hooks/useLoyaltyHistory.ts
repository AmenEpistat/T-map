import { useEffect } from 'react';
import { profileStore } from '@/entities/profile';
import { reaction } from 'mobx';

export const useLoyaltyHistory = () => {
    const { data, isLoading } = profileStore.loyaltyHistory;

    useEffect(() => {
        const dispose = reaction(
            () => profileStore.page,
            async () => {
                await profileStore.loadLoyaltyHistory();
            },
            {
                fireImmediately: true,
            }
        );

        return () => dispose();
    }, []);

    return {
        data,
        isLoading,
        setPage: (page: number) => profileStore.setPage(page),
    };
};
