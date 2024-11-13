import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Inyección del manifiesto de precacheo
precacheAndRoute(self.__WB_MANIFEST);

// Manejo de eventos push para notificaciones
self.addEventListener("push", (event) => {
  const data = event.data.json();
  const { title, message } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: "/galaxia_glamour.png",
    })
  );
});

// Manejo de clic en las notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Puedes ajustar la URL si lo necesitas
  );
});

// Caching runtime para imágenes
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
      }),
    ],
  })
);
