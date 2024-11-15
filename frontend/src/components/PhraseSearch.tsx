// frontend/src/components/PhraseSearch.tsx
import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonSkeletonText,
  IonToggle,
} from "@ionic/react";
import {
  documentTextOutline,
  starOutline,
  heartOutline,
  pricetagOutline,
  statsChartOutline,
  personOutline,
  bookmarkOutline,
  search,
} from "ionicons/icons";
import { apiService } from "../services/api.service";
import { Phrase } from "../types/Phrase";

// Interfaces para el tipado
interface StatsData {
  total: number;
  verified: number;
  favorites: number;
  withTranslations: number;
  userFavorites: number;
  uniqueTags: string[];
  uniqueAuthors: string[];
  uniqueCategories: string[];
}

interface PhraseStatsProps {
  phrases: Phrase[];
  onTagSelect?: (tag: string) => void;
  onAuthorSelect?: (author: string) => void;
  onCategorySelect?: (category: string) => void;
  onToggleFavorites?: (showOnlyFavorites: boolean) => void;
}

const PhraseSearch: React.FC<PhraseStatsProps> = ({
  phrases,
  onTagSelect,
  onAuthorSelect,
  onCategorySelect,
  onToggleFavorites,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [totalStats, setTotalStats] = useState<StatsData>({
    total: 0,
    verified: 0,
    favorites: 0,
    withTranslations: 0,
    userFavorites: 0,
    uniqueTags: [],
    uniqueAuthors: [],
    uniqueCategories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "tags" | "authors" | "categories" | null
  >(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const fetchTotalStats = async () => {
      try {
        console.log("Fetching stats...");
        setIsLoading(true);
        //const response = await apiService.get<StatsData>("/phrases/stats");
        //console.log("Stats response:", response);
        //setTotalStats(response);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalStats();
  }, []);

  const handleFavoritesToggle = (event: CustomEvent) => {
    const isChecked = event.detail.checked;
    setShowOnlyFavorites(isChecked);
    onToggleFavorites?.(isChecked);
  };

  const filterItems = (items: string[], searchText: string) => {
    return items.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const renderSearchResults = () => {
    if (!searchText) return null;

    switch (activeFilter) {
      case "tags":
        return (
          <IonList className="search-results">
            {filterItems(totalStats.uniqueTags, searchText).map((tag) => (
              <IonItem
                key={`tag-${tag}`}
                button
                onClick={() => onTagSelect?.(tag)}
              >
                <IonIcon icon={pricetagOutline} slot="start" />
                <IonLabel>{tag}</IonLabel>
                <IonBadge slot="end">
                  {phrases.filter((p) => p.tags?.es?.includes(tag)).length}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        );
      case "authors":
        return (
          <IonList className="search-results">
            {filterItems(totalStats.uniqueAuthors, searchText).map((author) => (
              <IonItem
                key={`author-${author}`}
                button
                onClick={() => onAuthorSelect?.(author)}
              >
                <IonIcon icon={personOutline} slot="start" />
                <IonLabel>{author}</IonLabel>
                <IonBadge slot="end">
                  {phrases.filter((p) => p.author === author).length}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        );
      case "categories":
        return (
          <IonList className="search-results">
            {filterItems(totalStats.uniqueCategories, searchText).map(
              (category) => (
                <IonItem
                  key={`category-${category}`}
                  button
                  onClick={() => onCategorySelect?.(category)}
                >
                  <IonIcon icon={statsChartOutline} slot="start" />
                  <IonLabel>{category}</IonLabel>
                  <IonBadge slot="end">
                    {phrases.filter((p) => p.category === category).length}
                  </IonBadge>
                </IonItem>
              )
            )}
          </IonList>
        );
      default:
        return null;
    }
  };

  return (
    <IonCard className="stats-card">
      <IonCardContent>
        {isExpanded && (
          <div className="expanded-content">
            {isLoading ? (
              <div className="skeleton-stats">
                <IonSkeletonText
                  animated
                  style={{ width: "100%", height: "20px" }}
                />
                <IonSkeletonText
                  animated
                  style={{ width: "90%", height: "20px" }}
                />
                <IonSkeletonText
                  animated
                  style={{ width: "80%", height: "20px" }}
                />
              </div>
            ) : (
              <>
                <div className="stats-grid"></div>

                <IonAccordionGroup>
                  <IonAccordion>
                    <IonItem slot="header">
                      <IonLabel>Búsqueda y Filtros</IonLabel>

                      <IonIcon slot="start" icon={search} />
                    </IonItem>
                    <div slot="content" className="search-section">
                      <div className="filter-buttons">
                        <IonButton
                          fill={activeFilter === "tags" ? "solid" : "outline"}
                          onClick={() => setActiveFilter("tags")}
                        >
                          <IonIcon slot="start" icon={pricetagOutline} />
                          Tags ({totalStats.uniqueTags.length})
                        </IonButton>
                        <IonButton
                          fill={
                            activeFilter === "authors" ? "solid" : "outline"
                          }
                          onClick={() => setActiveFilter("authors")}
                        >
                          <IonIcon slot="start" icon={personOutline} />
                          Autores ({totalStats.uniqueAuthors.length})
                        </IonButton>
                        <IonButton
                          fill={
                            activeFilter === "categories" ? "solid" : "outline"
                          }
                          onClick={() => setActiveFilter("categories")}
                        >
                          <IonIcon slot="start" icon={statsChartOutline} />
                          Categorías ({totalStats.uniqueCategories.length})
                        </IonButton>
                      </div>

                      {activeFilter && (
                        <IonSearchbar
                          value={searchText}
                          onIonInput={(e) => setSearchText(e.detail.value!)}
                          placeholder={`Buscar por ${activeFilter}...`}
                          className="search-bar"
                          animated={true}
                          debounce={300}
                        />
                      )}

                      {renderSearchResults()}
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              </>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PhraseSearch;
