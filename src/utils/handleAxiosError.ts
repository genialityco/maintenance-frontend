import axios from "axios";

export const handleAxiosError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    const errorResponse = error.response?.data;
    throw new Error(errorResponse?.message || defaultMessage);
  } else {
    throw new Error("Error desconocido");
  }
};
