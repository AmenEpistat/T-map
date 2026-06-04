import { makeAutoObservable, runInAction } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import { adminUsersApi } from '../api/adminUsersApi';
import type {
    AdminUserModeration,
    AdminUserModerationPage,
    UserRole,
} from '@/shared/api/types';

const wrap = <T>(promise: Promise<T>): Promise<{ data: T }> =>
    promise.then((data) => ({ data }));

class AdminUsersStore {
    page = new RequestState<AdminUserModerationPage>();

    searchQuery = '';
    currentPage = 0;
    pageSize = 20;

    constructor() {
        makeAutoObservable(this);
    }

    search = async (query: string): Promise<void> => {
        this.searchQuery = query;
        this.currentPage = 0;

        await this.loadCurrentPage();
    };

    goToPage = async (page: number): Promise<void> => {
        this.currentPage = page;

        await this.loadCurrentPage();
    };

    block = async (id: string): Promise<AdminUserModeration> => {
        const user = await adminUsersApi.block(id);

        runInAction(() => {
            this.syncUser(user);
        });

        return user;
    };

    unblock = async (id: string): Promise<AdminUserModeration> => {
        const user = await adminUsersApi.unblock(id);

        runInAction(() => {
            this.syncUser(user);
        });

        return user;
    };

    clear = (): void => {
        this.page = new RequestState<AdminUserModerationPage>();
        this.searchQuery = '';
        this.currentPage = 0;
        this.pageSize = 20;
    };

    changeRole = async (
        id: string,
        role: UserRole
    ): Promise<AdminUserModeration> => {
        const user = await adminUsersApi.changeRole(id, role);

        runInAction(() => {
            this.syncUser(user);
        });

        return user;
    };

    private loadCurrentPage = async (): Promise<void> => {
        const query = this.searchQuery.trim();

        await this.page.execute(
            wrap(
                adminUsersApi.search({
                    query,
                    page: this.currentPage,
                    size: this.pageSize,
                })
            )
        );
    };

    private syncUser = (user: AdminUserModeration): void => {
        if (!this.page.data) return;

        this.page.data = {
            ...this.page.data,
            items: this.page.data.items.map((item) =>
                item.id === user.id ? user : item
            ),
        };
    };
}

export const adminUsersStore = new AdminUsersStore();
