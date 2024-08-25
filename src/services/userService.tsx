import { apiUser } from './axiosConfig.tsx'; 

// Definir la estructura de un usuario
interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  // Otros campos según la estructura de tu usuario
}

interface CreateUserPayload {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  // Otros campos necesarios para crear un usuario
}

// Crear un nuevo usuario
export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  try {
    const response = await apiUser.post<User>('/', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el usuario');
  }
};

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiUser.get<User[]>('/');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener los usuarios');
  }
};

// Obtener un usuario por ID
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiUser.get<User>(`/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
  }
};

// Actualizar un usuario
export const updateUser = async (userId: string, updatedData: Partial<User>): Promise<User> => {
  try {
    const response = await apiUser.put<User>(`/${userId}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
  }
};

// Eliminar un usuario
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await apiUser.delete<void>(`/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el usuario');
  }
};

// Obtener un usuario por número de teléfono
export const getUserByPhoneNumber = async (phoneNumber: string): Promise<User> => {
  try {
    const response = await apiUser.get<User>(`/phone/${phoneNumber}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al buscar el usuario');
  }
};

// Registrar un servicio tomado por el usuario
export const registerService = async (userId: string): Promise<void> => {
  try {
    const response = await apiUser.post<void>(`/service/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar el servicio');
  }
};

// Registrar un referido hecho por el usuario
export const registerReferral = async (userId: string): Promise<void> => {
  try {
    const response = await apiUser.post<void>(`/referral/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar el referido');
  }
};
