export type UserRole = 'USER' | 'BUSINESS_OWNER' | 'ADMIN';

export interface RegisterRequest {
    email: string;
    password: string;
    nickname: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    role: UserRole;
    accessToken: string;
}

// TODO: move to shared/api/types/common.ts when other modules appear
export interface ErrorResponse {
    code: string;
    message: string;
}