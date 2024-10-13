// /frontend/src/components/TodoItem.tsx
import React, { useState } from 'react';
import { IonItem, IonAvatar, IonLabel, IonButton, IonIcon, IonInput, IonProgressBar } from '@ionic/react';
import { checkmarkCircle, ellipseOutline, trash, pencil } from 'ionicons/icons';
import { Todo } from '../services/todoService';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [progress, setProgress] = useState(todo.progress || 0);
  const icon = todo.completed ? checkmarkCircle : ellipseOutline;
  const buttonColor = todo.completed ? 'success' : 'medium';

  const handleEdit = () => {
    if (isEditing) {
      onEdit(todo.id);
    }
    setIsEditing(!isEditing);
  };

  return (
    <IonItem className={todo.completed ? 'todo-completed' : 'todo-pending'} button>
      <IonAvatar slot="start">
        <img src={`https://picsum.photos/80/80?random=${todo.id}`} alt="avatar" />
      </IonAvatar>
      <IonLabel>
        {isEditing ? (
          <IonInput value={editedTitle} onIonChange={e => setEditedTitle(e.detail.value!)} />
        ) : (
          <h2>{todo.title}</h2>
        )}
        <p>Prioridad: {todo.priority}</p>
        <p>Tags: {todo.tags?.join(', ') || 'No tags'}</p>
        <p>Fecha estimada: {todo.estimatedDate || 'Sin fecha'}</p>
      </IonLabel>
      <IonProgressBar value={progress / 100}></IonProgressBar>
      <IonButton slot="end" color={buttonColor} onClick={() => onToggleComplete(todo.id)}>
        <IonIcon icon={icon} />
      </IonButton>
      <IonButton slot="end" color="medium" onClick={handleEdit}>
        <IonIcon icon={pencil} />
      </IonButton>
      <IonButton slot="end" color="danger" onClick={() => onDelete(todo.id)}>
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  );
};

export default TodoItem;
