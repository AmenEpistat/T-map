import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { env } from '@/shared/config/env';

async function enableMocks() {
    if (!import.meta.env.DEV) return;
    if (!env.USE_MOCKS) return;

    const { worker } = await import('@/shared/mocks');
    await worker.start({
        onUnhandledRequest: 'bypass',
    });
}

enableMocks().then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
});
