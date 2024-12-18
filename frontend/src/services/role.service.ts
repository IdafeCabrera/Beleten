// frontend/src/services/role.service.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/roles',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roleService = {
  getAllRoles: async () => {
    const response = await apiClient.get('/');
    return response.data;
  },
  getRoleById: async (id: number) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },
  createRole: async (data: { roleName: string; description: string }) => {
    const response = await apiClient.post('/', data);
    return response.data;
  },
  updateRole: async (id: number, data: { roleName: string; description: string }) => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },
  deleteRole: async (id: number) => {
    await apiClient.delete(`/${id}`);
  },
};