import { authHandlers } from './authHandlers.ts';
import { businessVenuesHandlers } from './businessVenuesHandlers.ts';

export const handlers = [...authHandlers, ...businessVenuesHandlers];
