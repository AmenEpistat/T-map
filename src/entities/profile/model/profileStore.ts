import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api';
import { profileApi } from '@/entities/profile/api/profileApi.ts';
import type {
    ChangePasswordPayload,
    LoyaltyHistory,
} from '@/entities/profile/model/types.ts';
import { PAGE_SIZE } from '@/entities/profile';

class ProfileStore {
    changePasswordState = new RequestState<{ message: string }>();

    page: number = 0;
    loyaltyHistory = new RequestState<LoyaltyHistory>();

    constructor() {
        makeAutoObservable(this);
    }

    setPage(page: number) {
        this.page = page;
    }

    async changePassword(passwords: ChangePasswordPayload) {
        await this.changePasswordState.execute(
            profileApi.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            })
        );

        return this.changePasswordState.error === null;
    }

    async loadLoyaltyHistory() {
        await this.loyaltyHistory.execute(
            profileApi.getLoyaltyHistory(this.page, PAGE_SIZE)
        );
    }
}

export const profileStore = new ProfileStore();
