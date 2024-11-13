import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Galaxia Glamour',
        short_name: 'Galaxia',
        description: 'Galaxia glamour lashes',
        display: 'standalone',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'galaxia_glamour.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'galaxia_glamour.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'galaxia_glamour.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      },
      // Indica el archivo personalizado del service worker
      // srcDir: 'src',
      // filename: 'custom-sw.js'
    })
  ]
});
