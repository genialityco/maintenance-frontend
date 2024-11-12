// notificationUtils.ts
import {
  checkSubscriptionExists,
  createSubscription,
} from "../services/notificationService";

type UserType = "organization" | "employee";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey = import.meta.env.VITE_APP_PUBLIC_VAPID_KEY;
const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

export const requestNotificationPermission = async (
  userType: UserType,
  userId: string
): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permiso de notificación concedido");
      await subscribeUser(userType, userId);
    } else {
      console.log("Permiso de notificación denegado");
    }
  } catch (error) {
    console.error("Error al solicitar permiso de notificación:", error);
  }
};

const subscribeUser = async (
  userType: UserType,
  userId: string
): Promise<void> => {
  if ("serviceWorker" in navigator && "PushManage" in window) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/custom-sw.js"
      );

      // Comprueba si ya existe una suscripción
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Si no hay suscripción, créala
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });
      }

      // Usa toJSON para obtener el endpoint
      const subscriptionData = subscription.toJSON();

      if (subscriptionData.endpoint) {
        // Verificar en el backend si esta suscripción ya existe
        const exists = await checkSubscriptionExists(subscriptionData.endpoint);
        // Solo crea la suscripción en el backend si no existe
        if (!exists) {
          if (subscriptionData.keys?.p256dh && subscriptionData.keys?.auth) {
            const formattedSubscription = {
              endpoint: subscriptionData.endpoint,
              keys: {
                p256dh: subscriptionData.keys.p256dh,
                auth: subscriptionData.keys.auth,
              },
              userType,
              userId,
            };
            await createSubscription(formattedSubscription);
          } else {
            console.error(
              "Error: Las claves de la suscripción están indefinidas"
            );
          }
          console.log("Usuario suscrito exitosamente");
        } else {
          console.log("La suscripción ya existe en el backend");
        }
      } else {
        console.error("Error: El endpoint de la suscripción está indefinido");
      }
    } catch (error) {
      console.error("Error al suscribir al usuario:", error);
    }
  } else {
    console.warn("Service workers no son compatibles en este navegador");
  }
};
