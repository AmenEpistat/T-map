import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { MapPage } from '@/pages/MapPage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';

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
