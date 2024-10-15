import { apiAppointment } from "./axiosConfig";
import { handleAxiosError } from "../utils/handleAxiosError";

// Definir la estructura de una cita
export interface Appointment {
  _id: string;
  service: string;
  startDate: Date;
  endDate: Date;
}

interface CreateAppointmentPayload {
  service: string;
  startDate: Date;
  endDate: Date;
}

interface Response<T> {
  code: number;
  status: string;
  data: T;
  message: string;
}

// Obtener todas las citas
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiAppointment.get<Response<Appointment[]>>("/");
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener las citas");
    return [];
  }
};

// Obtener una cita por ID
export const getAppointmentById = async (
  appointmentId: string
): Promise<Appointment | undefined> => {
  try {
    const response = await apiAppointment.get<Response<Appointment>>(`/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener la cita");
  }
};

// Crear una nueva cita
export const createAppointment = async (
  appointmentData: CreateAppointmentPayload
): Promise<Appointment | undefined> => {
  try {
    const response = await apiAppointment.post<Response<Appointment>>("/", appointmentData);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear la cita");
  }
};

// Actualizar una cita
export const updateAppointment = async (
  appointmentId: string,
  updatedData: Partial<Appointment>
): Promise<Appointment | undefined> => {
  try {
    const response = await apiAppointment.put<Response<Appointment>>(
      `/${appointmentId}`,
      updatedData
    );
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al actualizar la cita");
  }
};

// Eliminar una cita
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    await apiAppointment.delete<Response<void>>(`/${appointmentId}`);
  } catch (error) {
    handleAxiosError(error, "Error al eliminar la cita");
  }
};
