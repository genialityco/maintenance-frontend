// Instala y fuerza el Service Worker para activarse de inmediato
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting(); // Fuerza que el nuevo SW se active de inmediato
});

// Activa el nuevo Service Worker y toma el control de todas las pestañas
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim()); // Toma control de todos los clientes activos (pestañas)
});

// Maneja las notificaciones push
self.addEventListener("push", (event) => {
  console.log("Push notification received", event);

  let data = {
    title: "Nueva Notificación",
    body: "Tienes una nueva actualización!",
  };
  if (event.data) {
    data = { ...data, ...event.data.json() };
  }

  const options = {
    body: data.body,
    icon: data.icon || "/galaxia_glamour.png", // Ruta al ícono en public/
    badge: data.badge || "/galaxia_glamour.png",
    data: { url: data.url || "/" }, // Asegura que `url` esté siempre definido
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Maneja el clic en la notificación y abre la URL asociada
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url || "/"; // Redirige a la raíz si `url` no está definido

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Opcional: Maneja el cierre de la notificación
self.addEventListener("notificationclose", (event) => {
  console.log("Notification was closed", event);
});
