/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Автомийка: онлайн-запис',
        short_name: 'Автомийка',
        description: 'Запис на автомийку та детейлінг онлайн',
        lang: 'uk',
        theme_color: '#0891b2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // Кешуємо лише перелік послуг (публічні за змістом дані): спершу мережа,
            // за її відсутності кеш (до 5 хв). Особисті дані (авто, профіль) не кешуємо,
            // щоб після виходу з облікового запису вони не лишались на пристрої.
            urlPattern: ({ url, request }) =>
              request.method === 'GET' && url.pathname.startsWith('/api/services'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'services-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 30, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
    // Карта складу пакета: npm run analyze -> stats.html
    process.env.ANALYZE ? visualizer({ filename: process.env.ANALYZE_JSON ? 'stats.json' : 'stats.html', template: process.env.ANALYZE_JSON ? 'raw-data' : 'treemap', gzipSize: true }) : null,
  ],
  // Псевдонім @/ береться з paths у tsconfig.app.json
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
