import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { MapPage } from '@/pages/MapPage';
import { AuthPage } from '@/pages/AuthPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: React.createElement(MapPage),
    },
    {
        path: '/auth/login',
        element: <AuthPage />,
    },
]);
