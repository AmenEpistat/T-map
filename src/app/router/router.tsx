import { Navigate, createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthPage } from '@/pages/auth';
import { MapPage } from '@/pages/map';
import { BusinessLayout, VenuesPage, VenueManagePage } from '@/pages/business';
import { AdminLayout, AdminModerationPage } from '@/pages/admin';
import { AddVenueForm } from '@/features/venue-create';
import { EditVenueForm } from '@/features/venue-edit';
import { AdminProtectedRoute, ProtectedRoute } from '@/shared/ui';
import { NotFoundPage } from '@/pages/not-found';

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
        path: '/business',
        element: (
            <ProtectedRoute>
                <BusinessLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                element: <VenuesPage />,
                children: [
                    { index: true, element: null },
                    { path: 'new', element: <AddVenueForm /> },
                ],
            },
            {
                path: ':id',
                element: <VenueManagePage />,
                children: [
                    { index: true, element: null },
                    { path: 'edit', element: <EditVenueForm /> },
                ],
            },
        ],
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminProtectedRoute>
                    <AdminLayout />
                </AdminProtectedRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to='moderation' replace />,
            },
            {
                path: 'moderation',
                element: <AdminModerationPage />,
                children: [
                    { index: true, element: null },
                    { path: ':id', element: null },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
