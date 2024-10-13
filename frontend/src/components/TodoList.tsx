// /frontend/src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonToast,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonButton,
} from '@ionic/react';
import { getTodos, createTodo, deleteTodo, updateTodo, Todo } from '../services/todoService';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';
import FabMenu from './FabMenu';
import TodoModal from './TodoModal';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null); // Id de la tarea en edición

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, filter, searchTerm]);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error al obtener los todos:', error);
    }
  };

  const handleCreateOrUpdateTodo = async (todo: Partial<Todo>) => {
    try {
      if (todo.id) {
        // Encontrar la tarea existente para combinarla con los nuevos datos
        const existingTodo = todos.find(t => t.id === todo.id);
  
        if (existingTodo) {
          // Combinar el todo existente con las nuevas actualizaciones para crear un objeto Todo completo
          const updatedTodo: Todo = { ...existingTodo, ...todo };
  
          // Llamar al servicio de actualización con el todo completo
          const updated = await updateTodo(todo.id, updatedTodo);
          
          // Actualizar el estado con la tarea modificada
          setTodos(todos.map(t => (t.id === todo.id ? updated : t)));
          setToastMessage('Tarea actualizada exitosamente');
        }
      } else {
        // Crear nueva tarea (aquí puedes seguir usando Partial<Todo> si el servicio lo permite)
        const newTodo = await createTodo(todo.title as string, todo);
        setTodos([...todos, newTodo]);
        setToastMessage('Tarea añadida exitosamente');
      }
    } catch (error) {
      console.error('Error al crear/actualizar la tarea:', error);
    }
  };
  

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setToastMessage('Tarea eliminada');
    } catch (error) {
      console.error('Error al eliminar el todo:', error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const todo = todos.find(todo => todo.id === id);
      if (todo) {
        const updatedTodo = await updateTodo(id, { ...todo, completed: !todo.completed });
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
        setToastMessage(todo.completed ? 'Tarea marcada como incompleta' : 'Tarea completada');
      }
    } catch (error) {
      console.error('Error al actualizar el todo:', error);
    }
  };

  const filterTodos = () => {
    let updatedTodos = [...todos];

    if (filter === 'completed') {
      updatedTodos = updatedTodos.filter(todo => todo.completed);
    } else if (filter === 'pending') {
      updatedTodos = updatedTodos.filter(todo => !todo.completed);
    }

    if (searchTerm.trim()) {
      updatedTodos = updatedTodos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTodos(updatedTodos);
  };

  const handleFabClick = () => {
    setIsModalOpen(true);  // Abrir el modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);  // Cerrar el modal
  };

  return (
    <IonContent>
      {/* Componente de búsqueda y filtros */}
      <TodoFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Botón FAB para abrir el modal */}
      <FabMenu onClick={handleFabClick} />

      {/* Modal para agregar/editar tarea */}
      <IonModal isOpen={isModalOpen} onDidDismiss={handleModalClose}>
        <TodoModal
          onClose={handleModalClose}
          onSave={handleCreateOrUpdateTodo}
          isOpen={isModalOpen}
        />
      </IonModal>

      {/* Lista de Todos */}
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}  
          todo={todo}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTodo}
          onEdit={(id) => setEditingTodoId(id)} // Editar tarea
        />
      ))}

      {/* Infinite Scroll */}
      <IonInfiniteScroll
        onIonInfinite={ev => {
          fetchTodos();
          setTimeout(() => ev.target.complete(), 500);
        }}
      >
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>

      {/* Toast para mostrar mensajes */}
      {toastMessage && (
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage(null)}
        />
      )}
    </IonContent>
  );
};

export default TodoList;
