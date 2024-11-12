self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'galaxia_glamour.png', 
      badge: 'galaxia_glamour.png'
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
  