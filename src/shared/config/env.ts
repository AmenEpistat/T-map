interface AppEnv {
    API_BASE_URL: string;
    USE_MOCKS: boolean;
}

function readEnv(): AppEnv {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const useMocks = import.meta.env.VITE_USE_MOCKS;

    if (!apiBaseUrl) {
        throw new Error('VITE_API_BASE_URL не определен. Проверь .env');
    }

    return {
        API_BASE_URL: apiBaseUrl,
        USE_MOCKS: useMocks === 'true',
    };
}

export const env = readEnv();
