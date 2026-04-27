import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://t-map.duckdns.org',
                changeOrigin: true,
                secure: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    css: {
        modules: {
            localsConvention: 'dashes',
        },
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "@/shared/styles/variables.scss" as *;
                    @use "@/shared/styles/mixins.scss" as *;
                `,
            },
        },
    },
});
