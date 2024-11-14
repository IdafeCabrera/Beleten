// frontend/src/components/PhraseSkeleton.tsx
import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardContent, 
  IonSkeletonText 
} from '@ionic/react';
import { CardDesign } from '../types/CardDesign';
import './PhraseSkeleton.css';

interface PhraseSkeletonProps {
  viewType: 'grid' | 'list';
  design?: CardDesign; // Hacemos design opcional
}

const PhraseSkeleton: React.FC<PhraseSkeletonProps> = ({ 
  viewType, 
  design = CardDesign.CLASSIC // Valor por defecto
}) => {
  const getSkeletonCount = () => {
    if (viewType === 'grid') {
      return window.innerWidth > 1200 ? 9 : 
             window.innerWidth > 768 ? 6 : 
             window.innerWidth > 480 ? 4 : 2;
    }
    return 3; // Para vista lista
  };

  const renderSkeletonCard = (index: number) => {
    const baseClass = `skeleton-card ${design.toLowerCase()}-skeleton`;
    return (
      <IonCard key={index} className={baseClass}>
        <IonCardHeader>
          <IonSkeletonText 
            animated={true} 
            className="skeleton-title"
          />
        </IonCardHeader>
        <IonCardContent>
          <IonSkeletonText 
            animated={true} 
            className="skeleton-content"
          />
          
          <IonSkeletonText 
            animated={true} 
            className="skeleton-author"
          />
          
          <div className="skeleton-tags">
            {Array(3).fill(null).map((_, i) => (
              <IonSkeletonText 
                key={i}
                animated={true} 
                className="skeleton-tag"
              />
            ))}
          </div>
          
          <div className="skeleton-actions">
            <IonSkeletonText animated={true} className="skeleton-button" />
            <IonSkeletonText animated={true} className="skeleton-button" />
          </div>
        </IonCardContent>
      </IonCard>
    );
  };

  return (
    <div className={`phrase-skeleton ${viewType}-view ${design.toLowerCase()}-layout`}>
      {Array(getSkeletonCount()).fill(null).map((_, index) => renderSkeletonCard(index))}
    </div>
  );
};

export default PhraseSkeleton;