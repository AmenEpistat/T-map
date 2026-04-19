import { makeAutoObservable, runInAction } from 'mobx';
import { registerAuthCallbacks, setAccessToken } from '@/shared/api';
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from '@/shared/api/types';
import { authApi } from '../api';
import type { User } from './types';

class AuthStore {
    accessToken: string | null = null;
    user: User | null = null;
    isInitializing = true;

    constructor() {
        makeAutoObservable(this);
        registerAuthCallbacks({
            onRefreshSuccess: (token) => {
                this.accessToken = token;
            },
            onRefreshFail: () => {
                this.clearAuth();
            },
        });
    }

    get isAuthenticated(): boolean {
        return this.accessToken !== null && this.user !== null;
    }

    setAuth = (response: AuthResponse): void => {
        this.accessToken = response.accessToken;
        this.user = { userId: response.userId, role: response.role };
        setAccessToken(response.accessToken);
    };

    clearAuth = (): void => {
        this.accessToken = null;
        this.user = null;
        setAccessToken(null);
    };

    login = async (data: LoginRequest): Promise<void> => {
        const response = await authApi.login(data);
        this.setAuth(response);
    };

    register = async (data: RegisterRequest): Promise<void> => {
        const response = await authApi.register(data);
        this.setAuth(response);
    };

    logout = async (): Promise<void> => {
        try {
            await authApi.logout();
        } finally {
            this.clearAuth();
        }
    };

    refresh = async (): Promise<void> => {
        const response = await authApi.refresh();
        this.setAuth(response);
    };

    initialize = async (): Promise<void> => {
        try {
            await this.refresh();
        } catch {
            this.clearAuth();
        } finally {
            runInAction(() => {
                this.isInitializing = false;
            });
        }
    };
}

export const authStore = new AuthStore();
