import { authHandlers } from './authHandlers.ts';
import { businessVenuesHandlers } from './businessVenuesHandlers.ts';
import { adminVenuesHandlers } from './adminVenuesHandlers.ts';
import { adminUsersHandlers } from './adminUsersHandlers.ts';

export const handlers = [
    ...authHandlers,
    ...businessVenuesHandlers,
    ...adminVenuesHandlers,
    ...adminUsersHandlers,
];
