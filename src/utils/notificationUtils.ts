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

if (!publicVapidKey) {
  throw new Error(
    "La clave pública VAPID no está definida. Verifica tus variables de entorno."
  );
}

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
    } else if (permission === "denied") {
      console.log("Permiso de notificación denegado por el usuario.");
    } else {
      console.log(
        "Permiso de notificación no fue concedido ni denegado (probablemente bloqueado)."
      );
    }
  } catch (error) {
    console.error("Error al solicitar permiso de notificación:", error);
  }
};

const subscribeUser = async (
  userType: UserType,
  userId: string
): Promise<void> => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      // Registrar el Service Worker
      const registration = await navigator.serviceWorker.register(
        "/custom-sw.js"
      );
      console.log("Service Worker registrado correctamente.");

      // Intentar obtener una suscripción existente
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        if (!applicationServerKey) {
          throw new Error(
            "La clave del servidor de aplicaciones (applicationServerKey) está indefinida."
          );
        }
        console.log("Creando nueva suscripción...");

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });
        console.log("Suscripción creada:", subscription);
      } else {
        console.log("Suscripción existente encontrada.");
      }

      const subscriptionData = subscription.toJSON();

      if (subscriptionData.endpoint) {
        const exists = await checkSubscriptionExists(subscriptionData.endpoint);

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
            console.log("Usuario suscrito exitosamente en el backend.");
          } else {
            console.error(
              "Error: Las claves de la suscripción están indefinidas."
            );
          }
        } else {
          console.log("La suscripción ya existe en el backend.");
        }
      } else {
        console.error("Error: El endpoint de la suscripción está indefinido.");
      }
    } catch (error) {
      console.error("Error al suscribir al usuario:", error);
    }
  } else {
    console.warn(
      "Service workers o Push Manager no son compatibles en este navegador."
    );
  }
};
