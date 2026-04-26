import { reaction } from 'mobx';
import { authStore } from '@/features/auth';
import { myVenuesStore } from '@/entities/venue';

let isSetUp = false;

export const setupStores = (): void => {
    if (isSetUp) return;
    isSetUp = true;

    reaction(
        () => authStore.user,
        (user, prevUser) => {
            if (prevUser && !user) {
                myVenuesStore.clear();
            }
        }
    );
};
