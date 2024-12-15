// frontend/src/components/PhraseSearchControls.tsx
import React, {
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  IonSearchbar,
  IonItem,
  IonLabel,
  IonList,
  IonSegmentButton,
  IonIcon,
  IonButton,
} from "@ionic/react";
import {
  personOutline,
  pricetagOutline,
  folderOutline,
  textOutline,
  arrowUp,
  arrowDown,
} from "ionicons/icons";
import { Phrase } from "../types/phrase.types";

// Definimos tipos específicos para evitar inconsistencias
type SearchType = "text" | "author" | "tag" | "category";
type SortField = "id" | "text" | "author" | "created_at" | "category";
type SortOrder = "asc" | "desc";

// Tipo para el filtro de búsqueda
interface SearchFilter {
  text: string;
  type: "text" | "author" | "tag" | "category";
}

// Interfaz para las estadísticas
interface PhraseStatsProps {
  displayedCount: number;
  totalCount: number;
  isFiltered: boolean;
}

// Interfaz principal del componente con todas las props necesarias
interface PhraseSearchControlsProps extends PhraseStatsProps {
  onSearch: (text: string, type: SearchType) => Promise<void>;
  onClearSearch: () => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
  currentSort: { field: SortField; order: SortOrder };
  displayedCount: number;
  totalCount: number;
  isSearchActive: boolean;
  isLoading: boolean;

  phrases: Phrase[];

  isFiltered: boolean;
  viewType: "grid" | "list";

  onViewChange: Dispatch<SetStateAction<"grid" | "list">>;
}

const PhraseSearchControls: React.FC<PhraseSearchControlsProps> = ({
  phrases,
  onSearch,
  onSortChange,
  currentSort,
  viewType,
  onViewChange,
  displayedCount,
  totalCount,
  isFiltered,




  onClearSearch,



  isSearchActive,
  isLoading
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('text');


  const handleSearchInput = useCallback(async (value: string) => {
    setSearchText(value);
    if (value.trim()) {
      await onSearch(value, searchType);
    } else {
      onClearSearch();
    }
  }, [searchType, onSearch, onClearSearch]);

  const handleClear = () => {
    setSearchText('');
    onClearSearch();
  };

  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    if (searchText.trim()) {
      onSearch(searchText, type);
    }
  };

  const suggestions = useMemo(() => {
    if (!searchText) return [];
    const text = searchText.toLowerCase();

    switch (searchType) {
      case "author":
        return [
          ...new Set(
            phrases
              .map((p) => p.author)
              .filter(
                (author): author is string =>
                  author !== null &&
                  author !== undefined &&
                  author.toLowerCase().includes(text)
              )
          ),
        ].slice(0, 5);
      case "tag":
        return [
          ...new Set(
            phrases
              .flatMap((p) => p.tags?.es || [])
              .filter(
                (tag): tag is string =>
                  tag !== null &&
                  tag !== undefined &&
                  tag.toLowerCase().includes(text)
              )
          ),
        ].slice(0, 5);
      case "category":
        return [
          ...new Set(
            phrases
              .map((p) => p.category)
              .filter(
                (category): category is string =>
                  category !== null &&
                  category !== undefined &&
                  category.toLowerCase().includes(text)
              )
          ),
        ].slice(0, 5);
      default:
        return phrases
          .filter((p) => p.text && p.text.toLowerCase().includes(text))
          .map((p) => p.text)
          .slice(0, 5);
    }
  }, [searchText, searchType, phrases]);

  const handleSort = (field: SortField) => {
    if (currentSort.field === field) {
      onSortChange(field, currentSort.order === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  return (
    <div className="phrase-search-controls">

            <div className="search-header">
        <div className="search-types">
          <IonButton 
            fill="clear" 
            size="small"
            className={searchType === 'text' ? 'active' : ''}
            onClick={() => handleTypeChange('text')}>
            <IonIcon icon={textOutline} />
          </IonButton>
          {/* Similar buttons for author, category, tag */}
        </div>
      </div>
      <div className="search-container">
        <div className="controls-row">
          <IonButton
            fill="clear"
            size="small"
            onClick={() => handleSort("text")}
          >
            <IonIcon
              icon={
                currentSort.field === "text" && currentSort.order === "asc"
                  ? arrowUp
                  : arrowDown
              }
            />
          </IonButton>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setSearchType("text")}
          >
            <IonIcon icon={textOutline} />
          </IonButton>

          <IonButton
            fill="clear"
            size="small"
            onClick={() => handleSort("author")}
          >
            <IonIcon
              icon={
                currentSort.field === "author" && currentSort.order === "asc"
                  ? arrowUp
                  : arrowDown
              }
            />
          </IonButton>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setSearchType("author")}
          >
            <IonIcon icon={personOutline} />
          </IonButton>

          <IonButton
            fill="clear"
            size="small"
            onClick={() => handleSort("category")}
          >
            <IonIcon
              icon={
                currentSort.field === "category" && currentSort.order === "asc"
                  ? arrowUp
                  : arrowDown
              }
            />
          </IonButton>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setSearchType("category")}
          >
            <IonIcon icon={folderOutline} />
          </IonButton>

          <IonButton
            fill="clear"
            size="small"
            onClick={() => setSearchType("tag")}
          >
            <IonIcon icon={pricetagOutline} />
          </IonButton>
        </div>
      </div>

      <div className="search-container">
        {suggestions.length > 0 && (
          <IonList className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <IonItem
                key={index}
                button
                onClick={() => {
                  if (suggestion) {
                    onSearch(suggestion, searchType);
                    setSearchText("");
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
          onIonInput={(e) => setSearchText(e.detail.value || "")}
          placeholder={`Buscar por ${searchType}...`}
          className="search-bar1"
          debounce={300}
        />
      </div>

      {/* Estadísticas */}
      <div className="stats-container">
        <span>
          {isFiltered
            ? `Mostrando ${displayedCount} de ${totalCount} frases`
            : `Total: ${totalCount} frases`}
        </span>
      </div>
    </div>
  );
};



export default PhraseSearchControls;
