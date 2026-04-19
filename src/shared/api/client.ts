import axios from 'axios';
import { env } from '@/shared/config/env';

export const apiClient = axios.create({
    baseURL: env.API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
