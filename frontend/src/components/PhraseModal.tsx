// frontend/src/components/PhraseModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  IonModal,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonContent,

  IonToolbar,
  IonTitle,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonChip
} from '@ionic/react';
import { close, save, image, text, information, person, closeCircle } from 'ionicons/icons';
import { Phrase } from '../types/Phrase';
import './PhraseModal.css';

interface PhraseModalProps {
  isOpen: boolean;
  phrase: Phrase | null;
  onClose: () => void;
  onSave: (phrase: Partial<Phrase>) => void;
}

// Primero define el tipo de props que acepta IonInput
interface Props extends React.ComponentProps<typeof IonInput> {
  placeholder: string;
  onIonKeyDown: (e: CustomEvent<KeyboardEvent>) => void;
  "clear-on-edit": boolean;
}

const PhraseModal: React.FC<PhraseModalProps> = ({ isOpen, phrase, onClose, onSave }) => {
  const [phraseText, setPhraseText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [activeSegment, setActiveSegment] = useState('basic');
  const [tagArray, setTagArray] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

   // Función para manejar el arrastre
   const initDrag = (e: React.MouseEvent) => {
    const modal = dragRef.current?.closest('.ion-modal') as HTMLElement;
    if (!modal) return;

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (e: MouseEvent) => {
      if (!isExpanded) {
        setPosition({
          x: e.clientX - startX,
          y: e.clientY - startY
        });
        modal.style.transform = `translate(${e.clientX - startX}px, ${e.clientY - startY}px)`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  

  useEffect(() => {
    if (phrase) {
      setPhraseText(phrase.text || '');
      setAuthor(phrase.author || '');
      setCategory(phrase.category || '');
      setTagArray(phrase.tags?.es || []);
    } else {
      setPhraseText('');
      setAuthor('');
      setCategory('');
      setTagArray([]);
    }
  }, [phrase]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      setTagArray([...tagArray, e.currentTarget.value.toString().trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleAddTag = (event: KeyboardEvent) => {
    const input = event.target as HTMLIonInputElement;
    if (input.value && event.key === 'Enter') {
      setTagArray([...tagArray, input.value.toString().trim()]);
      input.value = '';
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTagArray(tagArray.filter((_, index) => index !== indexToRemove));
  };

  const handleSegmentChange = (event: CustomEvent) => {
    setActiveSegment(event.detail.value);
  };

  const handleTextChange = (event: CustomEvent) => {
    setPhraseText(event.detail.value || '');
  };

  const handleAuthorChange = (event: CustomEvent) => {
    setAuthor(event.detail.value || '');
  };

  const handleCategoryChange = (event: CustomEvent) => {
    setCategory(event.detail.value || '');
  };

  const handleSave = () => {
    onSave({
      text: phraseText,
      author,
      category,
      tags: { es: tagArray }
    });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className={`custom-modal ${isExpanded ? 'expanded' : ''}`}
    >
      <div 
        ref={dragRef}
        className="draggable-header"
        onMouseDown={initDrag}
      ></div>
     
        <IonToolbar>
          <IonTitle>{phrase ? 'Editar Frase' : 'Nueva Frase'}</IonTitle>
          <IonButtons slot="end">
          <IonButton onClick={() => setIsExpanded(!isExpanded)}>
              <IonIcon icon={isExpanded ? 'contract' : 'expand'} />
            </IonButton>
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={activeSegment} onIonChange={handleSegmentChange}>
            <IonSegmentButton value="basic">
              <IonIcon icon={text} />
              <IonLabel>Básico</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="author">
              <IonIcon icon={person} />
              <IonLabel>Autor</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="media">
              <IonIcon icon={image} />
              <IonLabel>Media</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="extra">
              <IonIcon icon={information} />
              <IonLabel>Extra</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
    

      <IonContent className="ion-padding">
        {activeSegment === 'basic' && (
          <>
            <IonItem>
              <IonLabel position="stacked">Texto</IonLabel>
              <IonTextarea
                value={phraseText}
                onIonChange={handleTextChange}
                placeholder="Texto de la frase"
                autoGrow={true}
                className="custom-textarea"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Categoría</IonLabel>
              <IonSelect value={category} onIonChange={handleCategoryChange}>
                <IonSelectOption value="filosofía">Filosofía</IonSelectOption>
                <IonSelectOption value="ciencia">Ciencia</IonSelectOption>
                <IonSelectOption value="literatura">Literatura</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Etiquetas</IonLabel>
              <IonInput
  placeholder="Presiona Enter para añadir"
  onKeyDown={handleKeyDown}
  clearOnEdit={true}
/>
            </IonItem>
            
            
            <div className="tag-container">
              {tagArray.map((tag, index) => (
                <IonChip
                  key={index}
                  onClick={() => handleRemoveTag(index)}
                >
                  {tag}
                  <IonIcon icon={closeCircle} />
                </IonChip>
              ))}
            </div>
          </>
        )}

        {activeSegment === 'author' && (
          <IonItem>
            <IonLabel position="stacked">Autor</IonLabel>
            <IonInput
              value={author}
              onIonChange={handleAuthorChange}
              placeholder="Nombre del autor"
            />
          </IonItem>
        )}

        {activeSegment === 'media' && (
          // Contenido para la pestaña media
          <div>Contenido Media</div>
        )}

        {activeSegment === 'extra' && (
          // Contenido para la pestaña extra
          <div>Contenido Extra</div>
        )}
      </IonContent>

      <div className="modal-footer">
        <IonButton expand="block" onClick={handleSave}>
          <IonIcon icon={save} slot="start" />
          Guardar
        </IonButton>
      </div>
    </IonModal>
  );
};

export default PhraseModal;