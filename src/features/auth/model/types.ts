import type { UserRole } from '@/shared/api/types';

export interface User {
    userId: string;
    email: string;
    nickname: string;
    role: UserRole;
}
