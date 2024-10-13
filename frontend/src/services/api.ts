// /frontend/src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Reemplaza con la URL de tu backend

// Obtener todos los ítems de una colección
export const getItems = async (collection: string) => {
  return await axios.get(`${API_URL}/${collection}`);
};

// Alternar el estado de favorito de un ítem por su id
export const toggleFavorite = async (collection: string, id: number) => {
  return await axios.put(`${API_URL}/${collection}/${id}/favorite`);
};

// Buscar ítems por etiqueta en una colección
export const searchItemsByTag = async (collection: string, tag: string) => {
  return await axios.get(`${API_URL}/${collection}/search`, { params: { tag } });
};
