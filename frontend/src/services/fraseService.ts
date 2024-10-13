// /frontend/src/services/fraseService.ts

import axios from 'axios';
import API_BASE_URL from '../config';

// Definir la interfaz de una frase (cita)
export interface Frase {
  id: number;
  text: string;
  author: string;
  tags?: string[];  // Las etiquetas opcionales
}

// Obtener todas las frases
export const getFrases = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/frases`);
  return response.data;
};

// Crear una nueva frase
export const createFrase = async (text: string, author: string, tags: string[]) => {
  const response = await axios.post(`${API_BASE_URL}/api/frases`, {
    text,
    author,
    tags,
  });
  return response.data;
};

// Eliminar una frase
export const deleteFrase = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/api/frases/${id}`);
};



export const updateFrase = async (id: number, updatedFrase: Partial<Frase>) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/frases/${id}`, updatedFrase);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la frase", error);
    throw error;
  }
};

