import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  console.log('Sesión actual:', session);
  console.log('URL de la petición:', config.url);
  
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    console.log('Token enviado:', `Bearer ${session.user.accessToken}`);
  } else {
    console.log('No hay token disponible en la sesión');
  }
  
  console.log('Headers de la petición:', config.headers);
  return config;
}, (error) => {
  console.error('Error en el interceptor de solicitud:', error);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Respuesta exitosa:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
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

