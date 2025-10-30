import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        port: 5173,
        // Proxy API requests to Express backend
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            },
            '/audio': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            },
            '/images': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            }
        }
    },
});
