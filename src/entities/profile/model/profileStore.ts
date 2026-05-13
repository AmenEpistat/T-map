import { makeAutoObservable } from 'mobx';
import { RequestState } from '@/shared/api';
import { profileApi } from '@/entities/profile/api/profileApi.ts';
import type { ChangePasswordPayload } from '@/entities/profile/model/types.ts';

class ProfileStore {
    changePasswordState = new RequestState<{ message: string }>();

    constructor() {
        makeAutoObservable(this);
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
}

export const profileStore = new ProfileStore();
