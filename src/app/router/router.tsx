import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthPage } from '@/pages/auth';
import { MapPage } from '@/pages/map';
import { BusinessLayout, VenuesPage, VenueManagePage } from '@/pages/business';
import { AddVenueForm } from '@/features/venue-create';
import { EditVenueForm } from '@/features/venue-edit';
import { ProtectedRoute } from '@/shared/ui';
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
        path: '*',
        element: <NotFoundPage />,
    },
]);
