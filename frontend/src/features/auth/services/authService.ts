// frontend/src/features/auth/services/authService.ts
import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = 'http://192.168.74.226:8080/api'; // Backend URL

// Crear una instancia de axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permitir cookies/autenticación cruzada
});

// Interceptor para incluir el token JWT automáticamente en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Añadir el token en el header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// authService actualizado
export const authService = {
  // Iniciar sesión
  login: async (identifier: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      identifier,
      password,
    });

    if (response.data.token) {
      tokenService.saveToken(response.data.token); // Guardar token
    }

    return response.data;
  },

  // Registrar un usuario
  register: async (username: string, email: string, password: string, roleId?: number) => {
    const response = await apiClient.post('/auth/register', {
      username,
      email,
      password,
      roleId, // Enviar el roleId opcionalmente
    });

    return response.data;
  },

  // Obtener detalles del usuario autenticado
  getUserDetails: async () => {
    const response = await apiClient.get('/users/details');
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    tokenService.removeToken(); // Eliminar el token
  },
};
