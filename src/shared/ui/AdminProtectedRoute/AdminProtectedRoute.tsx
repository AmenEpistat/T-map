import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { authStore } from '@/features/auth';

interface AdminProtectedRouteProps {
    children: ReactNode;
}

export const AdminProtectedRoute = observer(
    ({ children }: AdminProtectedRouteProps) => {
        if (!authStore.isAdmin) {
            return <Navigate to='/' replace />;
        }

        return <>{children}</>;
    }
);
