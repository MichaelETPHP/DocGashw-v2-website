import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
        plugins: [sveltekit()],
        server: {
                port: 5000,
                host: '0.0.0.0',
                cors: true,
                hmr: {
                        clientPort: 443,
                },
                strictPort: true,
                fs: {
                        allow: ['.']
                },
                allowedHosts: [
                        '4993b5fd-1e48-4eae-b34a-4ae167d6a038-00-cnf05htx8si3.kirk.replit.dev',
                        'localhost',
                        '0.0.0.0',
                        '*.replit.dev'
                ]
        },
        preview: {
                port: 5000,
                host: '0.0.0.0',
                strictPort: true,
        }
});
