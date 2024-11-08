import axios, { AxiosInstance } from 'axios';

const API_BASE_URL: string =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? (import.meta.env.VITE_APP_API_URL as string)
    : (import.meta.env.VITE_APP_API_URL_DEPLOYMENT as string);

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
  });

  // Puedes añadir más interceptores si necesitas manejar ciertas cosas en las solicitudes o respuestas.

  return api;
};

// Crear instancias de Axios para diferentes partes de la API
const apiClient: AxiosInstance = createAxiosInstance(`${API_BASE_URL}/client`);
const apiAppointment: AxiosInstance = createAxiosInstance(`${API_BASE_URL}/appointment`);
const apiService: AxiosInstance = createAxiosInstance(`${API_BASE_URL}/service`);
const apiImage: AxiosInstance = createAxiosInstance(`${API_BASE_URL}/image`);
const apiEmployee: AxiosInstance = createAxiosInstance(`${API_BASE_URL}/employees`);
const apiAdvance: AxiosInstance = createAxiosInstance(`${API_BASE_URL}/advance`);

export { apiClient, apiAppointment, apiService, apiImage, apiEmployee, apiAdvance };
