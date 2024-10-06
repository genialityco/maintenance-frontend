import { apiAppointment } from "./axiosConfig";

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
  // Otros campos necesarios para crear una cita
}

// Crear una nueva cita
export const createAppointment = async (
  appointmentData: CreateAppointmentPayload
): Promise<Appointment> => {
  try {
    const response = await apiAppointment.post<Appointment>(
      "/",
      appointmentData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear la cita");
  }
};

// Obtener todas las citas
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiAppointment.get<Appointment[]>("/");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener las citas"
    );
  }
};

// Obtener una cita por ID
export const getAppointmentById = async (
  appointmentId: string
): Promise<Appointment> => {
  try {
    const response = await apiAppointment.get<Appointment>(`/${appointmentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener la cita"
    );
  }
};

// Actualizar una cita
export const updateAppointment = async (
  appointmentId: string,
  updatedData: Partial<Appointment>
): Promise<Appointment> => {
  try {
    const response = await apiAppointment.put<Appointment>(
      `/${appointmentId}`,
      updatedData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar la cita"
    );
  }
};

// Eliminar una cita
export const deleteAppointment = async (
  appointmentId: string
): Promise<void> => {
  try {
    await apiAppointment.delete(`/${appointmentId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar la cita"
    );
  }
};
