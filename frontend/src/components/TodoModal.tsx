// /frontend/src/components/TodoModal.tsx
import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { Todo } from '../services/todoService';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Partial<Todo>) => void; // Cambia el tipo aquí para aceptar un Partial<Todo>
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [dueDate, setDueDate] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const handleSave = () => {
    if (newTodoTitle.trim()) {
      const newTodo: Partial<Todo> = {
        title: newTodoTitle,
        tags,          // Estas propiedades ya existen en la interfaz Todo
        startDate,     // Asegúrate de que estas propiedades están definidas en la interfaz
        estimatedDate: dueDate,  // El nombre en el estado puede ser diferente al de la interfaz
        progress,
      };
      onSave(newTodo); // Guardar todo el objeto todo
      setNewTodoTitle('');
      setTags([]);
      setStartDate(new Date().toISOString());
      setDueDate('');
      setProgress(0);
      onClose();  // Cerrar el modal después de guardar
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agregar/Editar Tarea</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Título de la tarea</IonLabel>
          <IonInput
            value={newTodoTitle}
            placeholder="Escribe el título"
            onIonChange={e => setNewTodoTitle(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Etiquetas</IonLabel>
          <IonSelect
            value={tags}
            multiple={true}
            onIonChange={e => setTags(e.detail.value)}
          >
            <IonSelectOption value="Trabajo">Trabajo</IonSelectOption>
            <IonSelectOption value="Personal">Personal</IonSelectOption>
            <IonSelectOption value="Urgente">Urgente</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Fecha de inicio</IonLabel>
          <IonDatetime
  value={startDate}
  onIonChange={e => {
    const value = e.detail.value;
    if (Array.isArray(value)) {
      setStartDate(value[0]); // Toma la primera fecha si es un array
    } else if (typeof value === 'string') {
      setStartDate(value); // Si es una única fecha, la asigna directamente
    }
  }}
/>

        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Fecha de estimación</IonLabel>
          <IonDatetime
  value={dueDate}
  
  onIonChange={e => {
    const value = e.detail.value;
    if (Array.isArray(value)) {
      setDueDate(value[0]); // Si es un array, usa la primera fecha
    } else if (typeof value === 'string') {
      setDueDate(value); // Si es un string, úsalo directamente
    }
  }}
/>



        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Progreso</IonLabel>
          <IonInput
            type="number"
            value={progress}
            placeholder="Porcentaje de progreso"
            onIonChange={e => setProgress(parseInt(e.detail.value!, 10))}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleSave}>
          Guardar Tarea
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default TodoModal;
