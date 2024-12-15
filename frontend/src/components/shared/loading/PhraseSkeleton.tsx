// frontend/src/components/shared/loading/PhraseSkeleton.tsx
import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardContent, 
  IonSkeletonText 
} from '@ionic/react';
import { CardDesign } from '../../../types/card.types';
import './PhraseSkeleton.css';

interface PhraseSkeletonProps {
  viewType: 'grid' | 'list';
  design: CardDesign;
  count?: number;
}

const PhraseSkeleton: React.FC<PhraseSkeletonProps> = ({ 
  viewType, 
  design,
  count = 3  // Valor por defecto
}) => {
  return (
    <div className={`phrase-skeleton ${viewType}-view`}>
      {Array(count).fill(null).map((_, index) => (
        <IonCard key={`skeleton-${index}`} className={`skeleton-card ${design.toLowerCase()}`}>
          <IonCardHeader>
            <IonSkeletonText 
              animated={true} 
              style={{ width: '60%', height: '24px' }}
            />
          </IonCardHeader>
          
          <IonCardContent>
            {/* Texto principal */}
            <IonSkeletonText 
              animated={true} 
              style={{ width: '100%', height: '60px' }}
            />
            
            {/* Autor */}
            <div style={{ marginTop: '12px' }}>
              <IonSkeletonText 
                animated={true} 
                style={{ width: '40%', height: '16px' }}
              />
            </div>

            {/* Tags */}
            <div className="skeleton-tags" style={{ marginTop: '12px' }}>
              {Array(3).fill(null).map((_, i) => (
                <IonSkeletonText 
                  key={i}
                  animated={true} 
                  style={{ 
                    width: '60px', 
                    height: '24px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    marginRight: '8px'
                  }}
                />
              ))}
            </div>

            {/* Botones */}
            <div className="skeleton-actions">
              {Array(3).fill(null).map((_, i) => (
                <IonSkeletonText
                  key={i}
                  animated={true}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    marginLeft: i > 0 ? '8px' : '0'
                  }}
                />
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );
};

export default PhraseSkeleton;