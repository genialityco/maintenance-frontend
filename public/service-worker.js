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
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow("/") 
    );
  });
  