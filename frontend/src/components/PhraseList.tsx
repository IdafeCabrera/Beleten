// frontend/src/components/PhraseList.tsx
import React, { RefObject, useRef } from 'react';
import { IonList } from '@ionic/react';
import { Phrase } from '../types/Phrase';
import { CardDesign } from '../types/CardDesign';
import PhraseItem from './PhraseItem';
import './PhraseList.css';

interface PhraseListProps {
  phrases: Phrase[];
  onEdit: (phrase: Phrase) => void;
  onDelete: (id: number) => Promise<void>; 
  design: CardDesign;
  viewType: 'list' | 'grid';
  isLoading: boolean; 
  containerRef?: RefObject<HTMLDivElement>;
}

const PhraseList: React.FC<PhraseListProps> = ({ 
  phrases, 
  onEdit, 
  onDelete, 
  design,
  viewType,
  isLoading 
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!phrases || phrases.length === 0) {
    return (
      <div className="no-phrases">
        <p>No hay frases disponibles</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`phrase-list ${viewType}-view ${design.toLowerCase()}-layout ${isLoading ? 'loading-more' : ''}`}
      style={{
        display: viewType === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: viewType === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none',
        minHeight: phrases.length > 0 ? 'auto' : '200px'
      }}
    >
      {phrases.map((phrase, index) => (
        // Usar una combinación única de id e índice como key
        <PhraseItem
          key={`${phrase.id}-${index}`}
          phrase={phrase}
          onEdit={() => onEdit(phrase)}
          onDelete={() => onDelete(phrase.id)}
          design={design}
        />
      ))}
    </div>
  );
};

export default PhraseList;