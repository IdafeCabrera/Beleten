// frontend/src/components/PhraseStats.tsx
import React from 'react';
import { 
  IonCard, 
  IonCardContent, 
  IonIcon, 
  IonText,
  IonButton,
  IonButtons
} from '@ionic/react';
import { 
  documentTextOutline, 
  starOutline, 
  heartOutline,
  languageOutline,
  gridOutline,
  listOutline 
} from 'ionicons/icons';
import { Phrase } from '../types/Phrase';
import './PhraseStats.css';



interface PhraseStatsProps {
  phrases: Phrase[];
  displayedCount: number;
  totalCount: number;
  viewType: "grid" | "list";
  onViewChange: (viewType: "grid" | "list") => void;
  isFiltered: boolean;
}

const PhraseStats: React.FC<PhraseStatsProps> = ({ 
  phrases = [], 
  displayedCount,
  totalCount,
  viewType, 
  onViewChange,
  isFiltered
}) => {
  const stats = {
    verified: phrases?.filter(p => p?.is_verified)?.length || 0,
    favorites: phrases?.filter(p => p?.favorite)?.length || 0,
    withTranslations: phrases?.filter(p => p?.translations && p.translations.length > 0)?.length || 0,
  };

  const toggleView = () => {
    onViewChange(viewType === "grid" ? "list" : "grid");
  };

  return (
    <IonCard className="stats-card">
      <IonCardContent>
        <div className="stats-container">
          <div className="stat-item">
            <IonIcon icon={documentTextOutline} color="primary" />
            <div className="stat-info">
              <IonText className="stat-number">
                {isFiltered ? `${displayedCount}/${totalCount}` : displayedCount}
              </IonText>
              {isFiltered && (
                <IonText color="medium" className="stat-label">
                  Filtradas
                </IonText>
              )}
            </div>
          </div>

          <div className="stat-item">
            <IonIcon icon={starOutline} color="warning" />
            <div className="stat-info">
              <IonText className="stat-number">{stats.verified}</IonText>
            </div>
          </div>

          <div className="stat-item">
            <IonIcon icon={heartOutline} color="danger" />
            <div className="stat-info">
              <IonText className="stat-number">{stats.favorites}</IonText>
            </div>
          </div>

          <div className="stat-item">
            <IonIcon icon={languageOutline} color="success" />
            <div className="stat-info">
              <IonText className="stat-number">{stats.withTranslations}</IonText>
            </div>
          </div>

          <div className="view-toggle">
            <IonButton fill="clear" onClick={toggleView}>
              <IonIcon icon={viewType === "list" ? gridOutline : listOutline} />
            </IonButton>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PhraseStats;