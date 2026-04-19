import axios from 'axios';
import { env } from '@/shared/config/env';
import { getAccessToken } from './token-holder';

export const apiClient = axios.create({
    baseURL: env.API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
