import { apiNotification } from "./axiosConfig";
import { handleAxiosError } from "../utils/handleAxiosError";

// Definir la estructura de una suscripción de notificación
export interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userType: string;
  userId: string;
}

// Crear una nueva suscripción de notificación
export const createSubscription = async (
  subscriptionData: Subscription
): Promise<void> => {
  try {
    await apiNotification.post("/subscribe", {
      subscriptionData,
      userType: subscriptionData.userType,
      userId: subscriptionData.userId,
    });
  } catch (error) {
    handleAxiosError(error, "Error al crear la suscripción de notificación");
  }
};

// Enviar notificación a un tipo específico de usuario
export const notifyUserType = async (
  userType: string,
  userId: string,
  title: string,
  message: string
): Promise<void> => {
  try {
    await apiNotification.post("/notify", {
      userType,
      userId,
      title,
      message,
    });
  } catch (error) {
    handleAxiosError(error, "Error al enviar notificación");
  }
};

// Verificar si una suscripción ya existe usando `GET`
export const checkSubscriptionExists = async (
  endpoint: string
): Promise<boolean> => {
  try {
    const response = await apiNotification.get("/check", {
      params: { endpoint: endpoint },
    });
    console.log(response.data);
    const data = response.data.data;
    return data.exists; 
  } catch (error) {
    handleAxiosError(error, "Error al verificar la suscripción");
    return false;
  }
};
