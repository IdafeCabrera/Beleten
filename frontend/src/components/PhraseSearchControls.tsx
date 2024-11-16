// frontend/src/components/PhraseSearchControls.tsx
import React, { useState, useMemo } from 'react';
import { 
  IonSearchbar, 
  IonItem, 
  IonLabel,
  IonList,
  IonSegmentButton,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { 
  personOutline, 
  pricetagOutline, 
  folderOutline, 
  textOutline,
  arrowUp,
  arrowDown 
} from 'ionicons/icons';
import { Phrase } from '../types/Phrase';

interface PhraseSearchControlsProps {
  phrases: Phrase[];
  onSearch: (text: string, type: 'text' | 'author' | 'tag' | 'category') => void;
  onSortChange: (field: 'id' | 'text' | 'author' | 'createdAt' | 'category', order: 'asc' | 'desc') => void;
  currentSort: {
    field: 'id' | 'text' | 'author' | 'createdAt' | 'category';
    order: 'asc' | 'desc';
  };
}

const PhraseSearchControls: React.FC<PhraseSearchControlsProps> = ({ 
  phrases, 
  onSearch, 
  onSortChange,
  currentSort 
}) => {
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
          .slice(0, 5);
    }
  }, [searchText, searchType, phrases]) || [];  // Añadido el valor por defecto

  const handleSort = (field: typeof currentSort.field) => {
    if (currentSort.field === field) {
      onSortChange(field, currentSort.order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  return (
<div className="search-controls1">



    {/* Text Controls */}
    <div className="control-group">
      <IonButton fill="clear" size="small" onClick={() => handleSort('text')}>
        <IonIcon icon={currentSort.field === 'text' && currentSort.order === 'asc' ? arrowUp : arrowDown} />
      </IonButton>
      <IonButton fill="clear" size="small" onClick={() => setSearchType('text')}>
        <IonIcon icon={textOutline} />
      </IonButton>
  

    {/* Author Controls */}

      <IonButton fill="clear" size="small" onClick={() => handleSort('author')}>
        <IonIcon icon={currentSort.field === 'author' && currentSort.order === 'asc' ? arrowUp : arrowDown} />
      </IonButton>
      <IonButton fill="clear" size="small" onClick={() => setSearchType('author')}>
        <IonIcon icon={personOutline} />
      </IonButton>
   

    {/* Category Controls */}

      <IonButton fill="clear" size="small" onClick={() => handleSort('category')}>
        <IonIcon icon={currentSort.field === 'category' && currentSort.order === 'asc' ? arrowUp : arrowDown} />
      </IonButton>
      <IonButton fill="clear" size="small" onClick={() => setSearchType('category')}>
        <IonIcon icon={folderOutline} />
      </IonButton>


    {/* Tags (solo búsqueda) */}

      <IonButton fill="clear" size="small" onClick={() => setSearchType('tag')}>
        <IonIcon icon={pricetagOutline} />
      </IonButton>

  </div>

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

<IonSearchbar
    value={searchText}
    onIonInput={e => setSearchText(e.detail.value || '')}
    placeholder={`Buscar por ${searchType}...`}
    className="search-bar1"
    debounce={300}
  />
</div>


  );
};

export default PhraseSearchControls;