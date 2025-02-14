import { apiMaintenanceRequest } from "./axiosConfig";
import { handleAxiosError } from "../utils/handleAxiosError";
import { Employee } from "./employeeService";

// Definir la estructura de una solicitud de mantenimiento
export interface MaintenanceRequest {
  updatedAt: string | number | Date | null | undefined;
  _id: string;
  reporterName: string;
  phoneNumber: string;
  location: string;
  damagedItem: "WALL" | "FLOOR" | "WINDOW" | "BULB";
  description: string;
  photo?: string;
  status: "Pending" | "In process" | "Complete";
  isAnonymous?: boolean;
  assignedEmployee?: Employee;
  createdAt: string;
}

// Definir la estructura de una nueva solicitud de mantenimiento
export interface CreateMaintenanceRequestPayload {
  reporterName: string;
  phoneNumber: string;
  location: string;
  damagedItem: "WALL" | "FLOOR" | "WINDOW" | "BULB";
  description: string;
  photo?: string;
  isAnonymous?: boolean;
}

// Definir la estructura de la asignación de empleados
export interface AssignEmployeePayload {
  employeeId: string;
}

interface Response<T> {
  code: number;
  status: string;
  data: T;
  message: string;
}

// Obtener todas las solicitudes de mantenimiento
export const getMaintenanceRequests = async (): Promise<
  MaintenanceRequest[]
> => {
  try {
    const response = await apiMaintenanceRequest.get<
      Response<MaintenanceRequest[]>
    >("/");
    return response.data.data;
  } catch (error) {
    handleAxiosError(
      error,
      "Error al obtener las solicitudes de mantenimiento"
    );
    return [];
  }
};

// Obtener una solicitud de mantenimiento por ID
export const getMaintenanceRequestById = async (
  requestId: string
): Promise<MaintenanceRequest | undefined> => {
  try {
    const response = await apiMaintenanceRequest.get<
      Response<MaintenanceRequest>
    >(`/${requestId}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener la solicitud de mantenimiento");
  }
};

// Crear una nueva solicitud de mantenimiento
export const createMaintenanceRequest = async (
  requestData: CreateMaintenanceRequestPayload
): Promise<MaintenanceRequest | undefined> => {
  try {
    const response = await apiMaintenanceRequest.post<
      Response<MaintenanceRequest>
    >("/", requestData);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear la solicitud de mantenimiento");
  }
};

// Actualizar el estado de una solicitud de mantenimiento
export const updateMaintenanceRequestStatus = async (
  requestId: string,
  status: "Pending" | "In process" | "Complete" // Estado corregido según el backend
): Promise<MaintenanceRequest | undefined> => {
  try {
    const response = await apiMaintenanceRequest.put<
      Response<MaintenanceRequest>
    >(`/${requestId}/status`, { status });
    return response.data.data;
  } catch (error) {
    handleAxiosError(
      error,
      "Error al actualizar el estado de la solicitud de mantenimiento"
    );
  }
};

// Asignar un empleado a una solicitud de mantenimiento
export const assignEmployeeToRequest = async (
  requestId: string,
  employeeId: string
): Promise<MaintenanceRequest | undefined> => {
  try {
    const response = await apiMaintenanceRequest.put<
      Response<MaintenanceRequest>
    >(`/${requestId}/assign`, { employeeId });
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al asignar un empleado a la solicitud");
  }
};

// Eliminar una solicitud de mantenimiento
export const deleteMaintenanceRequest = async (
  requestId: string
): Promise<void> => {
  try {
    await apiMaintenanceRequest.delete<Response<void>>(`/${requestId}`);
  } catch (error) {
    handleAxiosError(error, "Error al eliminar la solicitud de mantenimiento");
  }
};

// Actualizar una solicitud
export const updateMaintenanceRequest = async (
  requestId: string,
  data: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest | undefined> => {
  try {
    const response = await apiMaintenanceRequest.put<
      Response<MaintenanceRequest>
    >(`/${requestId}`, data);
    return response.data.data;
  } catch (error) {
    handleAxiosError(
      error,
      "Error al actualizar la solicitud de mantenimiento"
    );
  }
};
