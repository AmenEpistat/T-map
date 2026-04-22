import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthPage } from '@/pages/auth';
import { MapPage } from '@/pages/map';
import { ProfilePage } from '@/pages/profile';
import { ProtectedRoute } from '@/shared/ui';

export const router = createBrowserRouter([
    {
        path: '/',
        element: React.createElement(MapPage),
    },
    {
        path: '/auth/login',
        element: <AuthPage mode='login' />,
    },
    {
        path: '/auth/register',
        element: <AuthPage mode='register' />,
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        ),
    },
]);
