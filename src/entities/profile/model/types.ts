import type { UserRole } from '@/shared/api';
import type { Loyalty } from '@/shared/api/types/loyalty.ts';
import type { PaginationType } from '@/shared/api/types/pagination.ts';

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

export type LoyaltyHistory = PaginationType & {
    items: Loyalty[];
};
