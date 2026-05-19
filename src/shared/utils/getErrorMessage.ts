import { isAxiosError } from 'axios';
import type { ErrorResponse } from '@/shared/api/types';

export const getErrorMessage = (fallback: string, error: unknown): string => {
    if (isAxiosError<ErrorResponse>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};
