import type { UserRole } from '@/shared/api';

export type User = {
    userId: string;
    email: string;
    nickname: string;
    role: UserRole;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};
