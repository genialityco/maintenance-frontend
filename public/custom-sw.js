self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'galaxia_glamour.png', // Cambia a tu icono preferido
      badge: 'galaxia_glamour.png' // Puede ser otro icono más pequeño
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/')
    );
  });
  