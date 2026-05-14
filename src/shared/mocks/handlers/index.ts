import { authHandlers } from './authHandlers.ts';
import { businessVenuesHandlers } from './businessVenuesHandlers.ts';
import { adminVenuesHandlers } from './adminVenuesHandlers.ts';

export const handlers = [
    ...authHandlers,
    ...businessVenuesHandlers,
    ...adminVenuesHandlers,
];
