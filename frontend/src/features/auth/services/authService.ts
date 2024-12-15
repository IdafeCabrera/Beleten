// frontend/src/features/auth/services/authService.ts
import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = 'http://192.168.86.29:8080/api'; // backend URL

export const authService = {
  login: async (username: string, password: string) => {
    const credentials = btoa(`${username}:${password}`); // Codificar en Base64
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {},
      {
        headers: { Authorization: `Basic ${credentials}` },
        withCredentials: true, // Permitir cookies/autenticación cruzada
      }
    );

    if (response.data.token) {
      tokenService.saveToken(response.data.token);
    }

    return response.data;
  },

  register: async (username: string, password: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        username,
        password,
      },
      {
        withCredentials: true, // Permitir cookies/autenticación cruzada
      }
    );

    return response.data;
  },

  logout: () => {
    tokenService.removeToken();
  },
};
