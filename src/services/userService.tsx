import { apiUser } from "./axiosConfig";
import { handleAxiosError } from "../utils/handleAxiosError";

// Definir la estructura de un usuario
export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  servicesTaken: number;
  referralsMade: number;
}

interface CreateUserPayload {
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

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiUser.get<Response<User[]>>("/");
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener los usuarios");
    return [];
  }
};

// Obtener un usuario por ID
export const getUserById = async (
  userId: string
): Promise<User | undefined> => {
  try {
    const response = await apiUser.get<Response<User>>(`/${userId}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener el usuario");
  }
};

// Crear un nuevo usuario
export const createUser = async (
  userData: CreateUserPayload
): Promise<User | undefined> => {
  try {
    const response = await apiUser.post<Response<User>>("/", userData);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear el usuario");
  }
};

// Actualizar un usuario
export const updateUser = async (
  userId: string,
  updatedData: Partial<User>
): Promise<User | undefined> => {
  try {
    const response = await apiUser.put<Response<User>>(
      `/${userId}`,
      updatedData
    );
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al actualizar el usuario");
  }
};

// Eliminar un usuario
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await apiUser.delete<Response<void>>(`/${userId}`);
  } catch (error) {
    handleAxiosError(error, "Error al eliminar el usuario");
  }
};

// Obtener un usuario por número de teléfono
export const getUserByPhoneNumber = async (
  phoneNumber: string
): Promise<User | undefined> => {
  try {
    const response = await apiUser.get<Response<User>>(`/phone/${phoneNumber}`);
    return response.data.data;
  } catch (error) {
    handleAxiosError(error, "Error al buscar el usuario");
  }
};

// Registrar un servicio tomado por el usuario
export const registerService = async (userId: string): Promise<void> => {
  try {
    await apiUser.post<Response<void>>(`/service/${userId}`);
  } catch (error) {
    handleAxiosError(error, "Error al registrar el servicio");
  }
};

// Registrar un referido hecho por el usuario
export const registerReferral = async (userId: string): Promise<void> => {
  try {
    await apiUser.post<Response<void>>(`/referral/${userId}`);
  } catch (error) {
    handleAxiosError(error, "Error al registrar el referido");
  }
};
