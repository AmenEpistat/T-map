import { apiClient, refreshAuthSession } from '@/shared/api';
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from '@/shared/api/types';

export const authApi = {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/register',
            data
        );
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/login',
            data
        );
        return response.data;
    },

    refresh: refreshAuthSession,

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },
};
