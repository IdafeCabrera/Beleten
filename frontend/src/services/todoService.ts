// /frontend/src/services/todoService.ts
import axios from 'axios';
import API_BASE_URL from '../config';



// /frontend/src/services/todoService.ts (o donde esté definido el servicio)

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority?: string;
  tags?: string[];  // Añadir las etiquetas
  startDate?: string;  // Añadir fecha de inicio opcional
  estimatedDate?: string;  // Añadir fecha estimada de finalización opcional
  progress?: number;  // Añadir el progreso opcional
}

// Asegúrate de que las funciones como getTodos, createTodo, y updateTodo
// utilicen esta interfaz para asegurar el tipado.


export const getTodos = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/todos`);
  return response.data;
};

export const createTodo = async (title: string, todo: Partial<Todo>) => {
  const response = await axios.post(`${API_BASE_URL}/api/todos`, {
    title,
    completed: false,
    priority: 1,
  });
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/api/todos/${id}`);
};

export const updateTodo = async (id: number, updatedTodo: Todo) => {
  const response = await axios.put(`${API_BASE_URL}/api/todos/${id}`, updatedTodo);
  return response.data;
};




