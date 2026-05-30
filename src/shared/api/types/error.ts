export type ErrorMessage = {
    code?: string;
    message: string;
    status: number;
};

export const isErrorMessage = (error: unknown): error is ErrorMessage => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'message' in error &&
        'code' in error
    );
};
