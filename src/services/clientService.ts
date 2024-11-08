import { apiClient } from "./axiosConfig";
import { handleAxiosError } from "../utils/handleAxiosError";

// Definir la estructura de un cliente
export interface Client {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  servicesTaken: number;
  referralsMade: number;
}

interface CreateClientPayload {
  name: string;
  phoneNumber: string;
  email?: string;
}

interface Response<T> {
  code: number;
  status: string;
  data: T;
  message: string;
}

// Obtener todos los clientes
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get<Response<Client[]>>("/");
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener los clientes");
    return [];
  }
};

// Obtener un cliente por ID
export const getClientById = async (
  clientId: string
): Promise<Client | undefined> => {
  try {
    const response = await apiClient.get<Response<Client>>(`/${clientId}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener el cliente");
  }
};

// Crear un nuevo cliente
export const createClient = async (
  clientData: CreateClientPayload
): Promise<Client | undefined> => {
  try {
    const response = await apiClient.post<Response<Client>>("/", clientData);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear el cliente");
  }
};

// Actualizar un cliente
export const updateClient = async (
  clientId: string,
  updatedData: Partial<Client>
): Promise<Client | undefined> => {
  try {
    const response = await apiClient.put<Response<Client>>(
      `/${clientId}`,
      updatedData
    );
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al actualizar el cliente");
  }
};

// Eliminar un cliente
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    await apiClient.delete<Response<void>>(`/${clientId}`);
  } catch (error) {
    handleAxiosError(error, "Error al eliminar el cliente");
  }
};

// Obtener un cliente por número de teléfono
export const getClientByPhoneNumber = async (
  phoneNumber: string
): Promise<Client | undefined> => {
  try {
    const response = await apiClient.get<Response<Client>>(
      `/phone/${phoneNumber}`
    );
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al buscar el cliente");
  }
};

// Registrar un servicio tomado por el cliente
export const registerService = async (clientId: string): Promise<void> => {
  try {
    await apiClient.post<Response<void>>(`/service/${clientId}`);
  } catch (error) {
    handleAxiosError(error, "Error al registrar el servicio");
  }
};

// Registrar un referido hecho por el cliente
export const registerReferral = async (clientId: string): Promise<void> => {
  try {
    await apiClient.post<Response<void>>(`/referral/${clientId}`);
  } catch (error) {
    handleAxiosError(error, "Error al registrar el referido");
  }
};
