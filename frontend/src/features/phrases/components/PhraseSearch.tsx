// frontend/src/features/phrases/components/PhraseSearch.tsx
// frontend/src/components/PhraseSearch.tsx
import React, { useState, useMemo } from 'react';
import { 
  IonSearchbar, 
  IonItem, 
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonIcon
} from '@ionic/react';
import { 
  personOutline, 
  pricetagOutline, 
  folderOutline, 
  textOutline 
} from 'ionicons/icons';
import { Phrase } from '../types/phrase.types';

interface Props {
  phrases: Phrase[];
  onSearch: (text: string, type: 'text' | 'author' | 'tag' | 'category') => void;
}

const PhraseSearch: React.FC<Props> = ({ phrases, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'author' | 'tag' | 'category'>('text');

  const suggestions = useMemo(() => {
    if (!searchText) return [];
    const text = searchText.toLowerCase();
    
    switch (searchType) {
      case 'author':
        return [...new Set(phrases
          .map(p => p.author)
          .filter((author): author is string => 
            author !== null && author !== undefined && 
            author.toLowerCase().includes(text)
          )
        )].slice(0, 5);
      case 'tag':
        return [...new Set(phrases
          .flatMap(p => p.tags?.es || [])
          .filter((tag): tag is string => 
            tag !== null && tag !== undefined && 
            tag.toLowerCase().includes(text)
          )
        )].slice(0, 5);
      case 'category':
        return [...new Set(phrases
          .map(p => p.category)
          .filter((category): category is string => 
            category !== null && category !== undefined && 
            category.toLowerCase().includes(text)
          )
        )].slice(0, 5);
      default:
        return phrases
          .filter(p => p.text && p.text.toLowerCase().includes(text))
          .map(p => p.text)
          .slice(0, 5) as string[];
    }
  }, [searchText, searchType, phrases]);

  return (
    <div className="search-section">
      <IonSegment value={searchType} onIonChange={e => setSearchType(e.detail.value as any)}>
        <IonSegmentButton value="text">
          <IonIcon icon={textOutline} />
        </IonSegmentButton>
        <IonSegmentButton value="author">
          <IonIcon icon={personOutline} />
        </IonSegmentButton>
        <IonSegmentButton value="tag">
          <IonIcon icon={pricetagOutline} />
        </IonSegmentButton>
        <IonSegmentButton value="category">
          <IonIcon icon={folderOutline} />
        </IonSegmentButton>
      </IonSegment>

      <IonSearchbar
        value={searchText}
        onIonInput={e => setSearchText(e.detail.value || '')}
        placeholder={`Buscar por ${searchType}...`}
        className="search-bar"
        debounce={300}
      />

      {suggestions.length > 0 && (
        <IonList className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <IonItem 
              key={index} 
              button 
              onClick={() => {
                if (suggestion) {
                  onSearch(suggestion, searchType);
                  setSearchText('');
                }
              }}
            >
              <IonLabel>{suggestion}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};

export default PhraseSearch;