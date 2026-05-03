export type ErrorMessage = {
    code: string;
    message: string;
};

export const isErrorMessage = (error: unknown): error is ErrorMessage => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        'code' in error
    );
};
