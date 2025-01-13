import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    config.withCredentials = true;
  } else {
    console.log('No hay token disponible en la sesión');
  }
  
  return config;
}, (error) => {
  console.error('Error en el interceptor de solicitud:', error);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        case 403:
          throw new Error('No tienes permisos para realizar esta acción.');
        case 404:
          throw new Error('El recurso solicitado no existe.');
        case 500:
          throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
        default:
          throw new Error('Ha ocurrido un error inesperado.');
      }
    }
    throw new Error('Error de conexión con el servidor.');
  }
);

export default axiosInstance;

