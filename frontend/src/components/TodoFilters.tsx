// /frontend/src/components/TodoFilters.tsx
import React from 'react';
import { IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/react';

interface TodoFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: 'all' | 'completed' | 'pending';
  setFilter: (filter: 'all' | 'completed' | 'pending') => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ searchTerm, setSearchTerm, filter, setFilter }) => {
  return (
    <>
      {/* Barra de búsqueda */}
      <IonSearchbar
        value={searchTerm}
        onIonInput={(e) => setSearchTerm(e.detail.value!)}
        placeholder="Buscar tareas"
      />

      {/* Segmento para filtrar por completadas, pendientes o todas */}
      <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as any)}>
        <IonSegmentButton value="all">Todas</IonSegmentButton>
        <IonSegmentButton value="completed">Completadas</IonSegmentButton>
        <IonSegmentButton value="pending">Pendientes</IonSegmentButton>
      </IonSegment>
    </>
  );
};

export default TodoFilters;
