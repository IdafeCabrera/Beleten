// frontend/src/components/PhraseStats.tsx
import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonItem, IonLabel, IonText, IonToggle } from '@ionic/react';
import { 
  documentTextOutline, 
  starOutline, 
  heartOutline,
  languageOutline, 
  bookmarkOutline
} from 'ionicons/icons';
import { Phrase } from '../types/Phrase';
import './PhraseStats.css';
import PhraseSearch from './PhraseSearch';

interface PhraseStatsProps {
  phrases: Phrase[];
}



const PhraseStats: React.FC<PhraseStatsProps> = ({ phrases = [] }) => {
  // Cálculos de estadísticas con comprobaciones de nulo
  const stats = {
    total: phrases?.length || 0,
    verified: phrases?.filter(p => p?.is_verified)?.length || 0,
    favorites: phrases?.filter(p => p?.favorite)?.length || 0,
    withTranslations: phrases?.filter(p => p?.translations && p.translations.length > 0)?.length || 0,
    categories: new Set(phrases?.map(p => p?.category).filter(Boolean))?.size || 0
  };

  return (
    
    <IonCard className="stats-card">
      <IonCardContent>
      
        <div className="stats-container">
          
          <div className="stat-item">
            <IonIcon icon={documentTextOutline} color="primary" />
            <div className="stat-info">
              {/* <IonText color="medium">Total</IonText> */}
              <IonText className="stat-number">{stats.total}</IonText>
            </div>
          </div>
          
          <div className="stat-item">
            <IonIcon icon={starOutline} color="warning" />
            <div className="stat-info">
              {/* <IonText color="medium">Verificadas</IonText> */}
              <IonText className="stat-number">{stats.verified}</IonText>
            </div>
          </div>
          
          {phrases?.some(p => 'favorite' in p) && (
            <div className="stat-item">
              <IonIcon icon={heartOutline} color="danger" />
              <div className="stat-info">
                {/* <IonText color="medium">Favoritas</IonText> */}
                <IonText className="stat-number">{stats.favorites}</IonText>
              </div>
            </div>
          )}

          <div className="stat-item">
            <IonIcon icon={languageOutline} color="success" />
            <div className="stat-info">
              {/* <IonText color="medium">Traducidas</IonText> */}
              <IonText className="stat-number">{stats.withTranslations}</IonText>
            </div>
          </div>



          <div className="stat-item">
                    <IonIcon icon={heartOutline} color="danger" />
                    <div className="stat-info">
                      {/* <IonText color="medium">Mis Favoritas</IonText> */}
                      <div className="stat-number">0</div>
                    </div>
                  </div>
                  


        </div>

      </IonCardContent>
    </IonCard>
  );
};

export default PhraseStats;