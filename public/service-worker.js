import { clientsClaim, precacheAndRoute } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Configuración de Workbox
self.skipWaiting();
clientsClaim();

// Precarga y almacenamiento en caché de rutas específicas
precacheAndRoute(self.__WB_MANIFEST);

// Caching de imágenes con estrategia de CacheFirst
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// Configuración de notificaciones push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const { title, message } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: '/galaxia_glamour.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Ajusta la URL si es necesario
  );
});
