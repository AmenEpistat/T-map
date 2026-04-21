import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import { authStore } from '@/features/auth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
    const location = useLocation();

    if (authStore.isInitializing) {
        return null;
    }

    if (!authStore.isAuthenticated) {
        return <Navigate to='/auth/login' state={{ from: location }} replace />;
    }

    return <>{children}</>;
});
