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
  design: CardDesign;
  count?: number;
}

const PhraseSkeleton: React.FC<PhraseSkeletonProps> = ({ 
  viewType, 
  design,
  count = 3
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
            <IonSkeletonText 
              animated={true} 
              style={{ width: '100%', height: '60px' }}
            />
            <div style={{ marginTop: '12px' }}>
              <IonSkeletonText 
                animated={true} 
                style={{ width: '40%', height: '16px' }}
              />
            </div>
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
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );
};

export default PhraseSkeleton;