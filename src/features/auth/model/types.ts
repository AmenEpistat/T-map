import type { UserRole } from '@/shared/api/types';

export interface User {
    userId: string;
    role: UserRole;
}
