// frontend/src/services/user.service.ts
import axios from 'axios';
import { tokenService } from '../features/auth/services/tokenService';

// Configuración de la instancia de Axios
const apiClient = axios.create({
  baseURL: '/api/users', // Base URL para los endpoints de usuario
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token en cada petición
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tipos de datos
export interface UserDetails {
  id: number;
  username: string;
  email: string;
  roleId: number;
}

export interface Favorite {
  id: number;
  text: string;
  author: string;
}

export interface EditRequest {
  id: number;
  phrase: string;
  status: string; // "pending", "approved", "rejected"
}

// Servicio centralizado para el usuario
export const userService = {
  // Obtener detalles del usuario autenticado
  fetchUserDetails: async (): Promise<UserDetails> => {
    const response = await apiClient.get('/details');
    return response.data;
  },

  // Obtener frases favoritas del usuario
  fetchUserFavorites: async (): Promise<Favorite[]> => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  // Obtener solicitudes de edición pendientes
  fetchEditRequests: async (): Promise<EditRequest[]> => {
    const response = await apiClient.get('/edit-requests');
    return response.data;
  },

  // Función adicional: enviar una solicitud de edición
  requestEditPermission: async (phraseId: number): Promise<void> => {
    await apiClient.post('/edit-requests', { phraseId });
  },
};

// Función para obtener los detalles del usuario autenticado
export const fetchUserDetails = async () => {
  const response = await apiClient.get('/details');
  return response.data;
};

