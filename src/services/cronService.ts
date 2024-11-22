import { apiCron } from "./axiosConfig";
import { handleAxiosError } from "../utils/handleAxiosError";

export const runDailyReminder = async (): Promise<void> => {
  try {
    const response = await apiCron.get(`/daily-reminder`);
    console.log("Recordatorio diario ejecutado:", response.data);
  } catch (error) {
    handleAxiosError(error, "Error al ejecutar el recordatorio diario");
  }
};
