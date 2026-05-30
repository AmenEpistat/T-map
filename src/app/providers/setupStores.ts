import { reaction } from 'mobx';
import { authStore } from '@/features/auth';
import { venuesStore } from '@/entities/venue';
import { moderationStore } from '@/entities/admin-venue';
import { adminUsersStore } from '@/entities/admin-user';

let isSetUp = false;

export const setupStores = (): void => {
    if (isSetUp) return;
    isSetUp = true;

    reaction(
        () => authStore.user,
        (user, prevUser) => {
            if (prevUser && !user) {
                venuesStore.clear();
                moderationStore.clear();
                adminUsersStore.clear();
            }
        }
    );
};
