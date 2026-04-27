import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
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
    build: {
        chunkSizeWarningLimit: 1600,
        rolldownOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('maplibre-gl')) {
                            return 'map-vendor';
                        }
                        if (id.includes('react') || id.includes('mobx')) {
                            return 'react-vendor';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});
