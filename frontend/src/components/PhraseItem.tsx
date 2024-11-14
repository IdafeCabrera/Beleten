// frontend/src/components/PhraseItem.tsx
import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonChip } from '@ionic/react';
import { pencil, trash, heart } from 'ionicons/icons';
import { Phrase } from '../types/Phrase';
import { CardDesign } from '../types/CardDesign';
import './PhraseItem.css';

interface PhraseItemProps {
  phrase: Phrase;
  onEdit: (phrase: Phrase) => void;  // Especificar que recibe una frase
  onDelete: (id: number) => Promise<void>;
  design: CardDesign;
}



const PhraseItem: React.FC<PhraseItemProps> = ({ phrase, onEdit, onDelete, design }) => {

  const IdBadge = () => (
    <div className="phrase-id-badge">
      #{phrase.id}
    </div>
  );

 
  const handleEdit = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    onEdit(phrase);
  };

  const handleDelete = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    onDelete(phrase.id);
  };
 
  
  const renderClassicDesign = () => (
    <IonCard className={`custom-card classic-card ${phrase.category?.toLowerCase()}`}>
      <IdBadge />
      <IonCardHeader>
        <IonCardTitle>{phrase.text}</IonCardTitle>
        
        {phrase.author && (
          <p className="author">— {phrase.author} {phrase.alias ? `(${phrase.alias})` : ''}</p>
        )}

        {phrase.category && (
          <p><strong>Categoría: </strong>{phrase.category}</p>
        )}

        {phrase.career && (
          <p><strong>Carrera: </strong>{phrase.career}</p>
        )}

        <div className="tags">
          {phrase.tags?.es?.map((tag: string, index: number) => (
            <IonChip key={index}>{tag}</IonChip>
          ))}
        </div>

        <div className="action-buttons">
          <IonButton fill="clear" onClick={() => onEdit(phrase)}>  {/* Corregido aquí */}
          <IonIcon icon={pencil} slot="icon-only" />
        </IonButton>
        <IonButton fill="clear" color="danger" onClick={() => onDelete(phrase.id)}>  {/* Y aquí */}
          <IonIcon icon={trash} slot="icon-only" />
        </IonButton>
      </div>
      </IonCardHeader>
    </IonCard>
  );

  const renderModernDesign = () => (
    <IonCard className="modern-card">
      <IdBadge />
      <div className="card-header">
        <IonIcon icon={heart} className="favorite-icon" />
      </div>
      <div className="card-content">
        <h2 className="quote-text">{phrase.text}</h2>
        {phrase.author && (
          <p className="author-text">— {phrase.author}</p>
        )}
        <div className="tags-container">
          {phrase.tags?.es?.map((tag: string, index: number) => (
            <IonChip key={index} className="modern-chip">{tag}</IonChip>
          ))}
        </div>
        <div className="action-buttons modern-buttons">
          <IonButton fill="clear" onClick={handleEdit}>
            <IonIcon icon={pencil} />
          </IonButton>
          <IonButton fill="clear" color="danger" onClick={handleDelete}>
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );

  const renderGradientDesign = () => (
    <IonCard className="gradient-card">
      <IdBadge />
      <div className="gradient-overlay">
        <div className="quote-content">
          <h2 className="gradient-quote">{phrase.text}</h2>
          {phrase.author && (
            <p className="gradient-author">— {phrase.author}</p>
          )}
          <div className="gradient-tags">
            {phrase.tags?.es?.map((tag: string, index: number) => (
              <span key={index} className="gradient-chip">{tag}</span>
            ))}
          </div>
        </div>
        <div className="gradient-buttons">
          <IonButton fill="clear" color="light" onClick={handleEdit}>
            <IonIcon icon={pencil} />
          </IonButton>
          <IonButton fill="clear" color="light" onClick={handleDelete}>
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );

  const renderMinimalDesign = () => (
    <IonCard className="minimal-card">
      <IdBadge />
      <div className="minimal-content">
        <blockquote className="minimal-quote">
          <p>{phrase.text}</p>
          {phrase.author && <footer>— {phrase.author}</footer>}
        </blockquote>
        <div className="minimal-tags">
          {phrase.tags?.es?.map((tag: string, index: number) => (
            <small key={index} className="minimal-tag">{tag}</small>
          ))}
        </div>
        <div className="minimal-actions">
          <IonButton fill="clear" size="small" onClick={handleEdit}>
            <IonIcon icon={pencil} slot="icon-only" />
          </IonButton>
          <IonButton fill="clear" size="small" color="danger" onClick={handleDelete}>
            <IonIcon icon={trash} slot="icon-only" />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );

  const designMap = {
    [CardDesign.CLASSIC]: renderClassicDesign,
    [CardDesign.MODERN]: renderModernDesign,
    [CardDesign.GRADIENT]: renderGradientDesign,
    [CardDesign.MINIMAL]: renderMinimalDesign
  };

  return designMap[design]();
};

export default PhraseItem;