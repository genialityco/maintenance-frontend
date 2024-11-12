// public/service-worker.js

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  // Fuerza la activación del nuevo Service Worker inmediatamente después de la instalación
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  // Toma control de todas las páginas bajo el scope sin esperar a que las páginas se recarguen
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("Push notification received", event);
  let data = { title: "Nueva Notificación", body: "Tienes una nueva actualización!" }; // Valores predeterminados

  if (event.data) {
    data = { ...data, ...event.data.json() }; // Combina datos predeterminados con los datos recibidos
  }

  const options = {
    body: data.body,
    icon: data.icon || "/galaxia_glamour.png", // Asegúrate de que este archivo esté en `public`
    badge: data.badge || "/galaxia_glamour.png",
    data: { url: data.url || "/" } // Proporciona una URL por defecto en `data` para evitar errores
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url || "/"; // Predeterminado a la raíz si `url` está indefinido

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
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

self.addEventListener("notificationclose", (event) => {
  console.log("Notification was closed", event);
});
