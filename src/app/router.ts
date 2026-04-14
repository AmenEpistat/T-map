import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import Index from '@/pages/MapPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: React.createElement(Index),
    },
]);
