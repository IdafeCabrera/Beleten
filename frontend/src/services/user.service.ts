// frontend/src/services/user.service.ts
import axios from 'axios';
import { tokenService } from '../features/auth/services/tokenService';

// Configuración de la instancia de Axios
const apiClient = axios.create({
  baseURL: 'http://192.168.74.226:8080/api/users', // Asegúrate de apuntar al puerto correcto
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiRolesClient = axios.create({
  baseURL: '/api/roles', // Ruta base correcta para roles
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
  isActive: boolean;
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

  // -------- CRUD de Usuarios --------
  // Obtener todos los usuarios
  getAllUsers: async () => {
    const response = await apiClient.get('/');
    return response.data; // Extraemos los datos directamente
  },





  // Crear un nuevo usuario
  createUser: async (data: Partial<UserDetails>): Promise<UserDetails> => {
    const response = await apiClient.post('/', data);
    return response.data;
  },

  // Actualizar un usuario
  updateUser: async (id: number, data: Partial<UserDetails>): Promise<UserDetails> => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },

  // Eliminar un usuario
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },

  // Activar o desactivar un usuario
  toggleUserStatus: async (id: number, isActive: boolean): Promise<UserDetails> => {
    const response = await apiClient.put(`/${id}`, { isActive });
    return response.data;
  },

};
apiRolesClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token en cada petición
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios
export const roleService = {
  getAllRoles: async () => {
    const response = await apiClient.get('/');
    return response.data;
  },
  getRoleById: async (id: number) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },
  createRole: async (data: any) => {
    const response = await apiClient.post('/', data);
    return response.data;
  },
  updateRole: async (id: number, data: any) => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },
  deleteRole: async (id: number) => {
    await apiClient.delete(`/${id}`);
  },
};


 /* Función para obtener los detalles del usuario autenticado */
export const fetchUserDetails = async () => {
  const response = await apiClient.get('/details');
  return response.data;

};


