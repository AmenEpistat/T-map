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
    build: {
        chunkSizeWarningLimit: 1600,
        rolldownOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (
                            id.includes('maplibre-gl') ||
                            id.includes('mapbox-gl')
                        ) {
                            return 'map-engine-vendor';
                        }
                        if (
                            id.includes('@deck/gl') ||
                            id.includes('@luma.gl')
                        ) {
                            return 'deck-gl-vendor';
                        }
                        if (id.includes('react') || id.includes('mobx')) {
                            return 'react-vendor';
                        }
                        if (id.includes('antd') || id.includes('@ant-design')) {
                            return 'ui-vendor';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
});
