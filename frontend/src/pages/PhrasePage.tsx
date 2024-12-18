// frontend/src/pages/PhrasePage.tsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import PhraseSortControls from "../features/phrases/components/PhraseSortControls";


import { SortField, SortOrder } from '../types/sorting';
import {
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFabButton,
  IonContent,
} from "@ionic/react";

import {
  gridOutline,
  listOutline,
  cardOutline,
  appsOutline,
  addOutline,
  eye,
} from "ionicons/icons";
import { CardPhraseDesign } from "../features/phrases/types/card.types";
import { usePhraseController } from "../controllers/usePhraseController";

import PhraseList from "../features/phrases/components/PhraseList";
import PhraseModal from "../features/phrases/components/PhraseModal";
import PhraseSkeleton from "../features/phrases/components/loading/PhraseSkeleton";
import "./PhrasePage.css";
import { InfiniteScrollCustomEvent } from "@ionic/core";

import PhraseStats from "../features/phrases/components/PhraseStats";
import Layout from '../components/layout/Layout';
import { useAuth } from '../app/providers/AuthProvider';

import PhraseSearch from "../features/phrases/components/PhraseSearch";

import PhraseSearchControls from "../features/phrases/components/PhraseSearchControls";

const PhrasePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedDesign, setSelectedDesign] = useState<CardPhraseDesign>(
    CardPhraseDesign.CLASSIC
  );

  
  /* const [viewType, setViewType] = useState<"grid" | "list">("grid"); */
  const [viewType, setViewType] = useState<"grid" | "list">(
    localStorage.getItem("preferredViewType") as "grid" | "list" || "grid"
  );

    // Guardar el tipo de vista en localStorage cuando cambie
    useEffect(() => {
      localStorage.setItem("preferredViewType", viewType);
    }, [viewType]);

  const {
    phrases,
    isLoading,
    error,
    isModalOpen,
    currentPhrase,
    openEditModal,
    closeModal,
    savePhrase,
    deletePhrase,
    loadMorePhrases,
    hasMore,
    totalPhrases,
    performSearch,
    clearSearch,   
    isSearchActive,
    
  } = usePhraseController();


    // Efecto para mantener la posición del scroll al cambiar de vista
    useEffect(() => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedScrollPosition),
            behavior: 'auto'
          });
          sessionStorage.removeItem("scrollPosition");
        }, 100);
      }
    }, [viewType]);


  // Modificar el handler de cambio de vista
/*   const handleViewTypeChange = (newViewType: "grid" | "list") => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    setViewType(newViewType);
  };
 */

    // Modificar el handler de cambio de vista para que sea compatible con SetStateAction
    const handleViewTypeChange = (value: "grid" | "list" | ((prev: "grid" | "list") => "grid" | "list")) => {
      const newViewType = typeof value === "function" ? value(viewType) : value;
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      setViewType(newViewType);
    };


  // Crear un ref para el contenedor de frases
  const containerRef = useRef<HTMLDivElement | null>(null);



  // En PhrasePage.tsx

  const handleInfiniteScroll = async (e: InfiniteScrollCustomEvent) => {
    console.log("🔄 Scroll triggered:", {
      loaded: phrases.length,
      total: totalPhrases,
      hasMore,
      isLoading,
    });

    try {
      if (isLoading || !hasMore) {
        console.log("⏹️ Scroll blocked:", { isLoading, hasMore });
        e.target.complete();
        return;
      }

      await loadMorePhrases();
      console.log("✅ Load more completed");
    } catch (error) {
      console.error("❌ Scroll error:", error);
    } finally {
      e.target.complete();
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: "id",
    order: "asc",
  });

  // Ordenar frases
  const sortedPhrases = useMemo(() => {
    if (!phrases) return [];

    return [...phrases].sort((a, b) => {
      const compareValue = (val1: any, val2: any) => {
        if (val1 === null || val1 === undefined) return 1;
        if (val2 === null || val2 === undefined) return -1;
        if (typeof val1 === "string") return val1.localeCompare(val2);
        return val1 - val2;
      };

      let comparison = 0;
      switch (sortConfig.field) {
        case "id":
          comparison = compareValue(a.id, b.id);
          break;
        case "author":
          comparison = compareValue(a.author, b.author);
          break;
          case "created_at":
            comparison = compareValue(
              new Date(a.created_at),
              new Date(b.created_at)
            );
            break;
        case "category":
          comparison = compareValue(a.category, b.category);
          break;
        default:
          comparison = compareValue(a.id, b.id);
      }

      return sortConfig.order === "asc" ? comparison : -comparison;
    });
  }, [phrases, sortConfig]);

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortConfig({ field, order });
  };

  const renderContent = () => {
    if (isLoading && phrases.length === 0) {
      return (
        <div className="initial-loading">
          <PhraseSkeleton
            viewType={viewType}
            design={selectedDesign}
            count={6} // Mostrar más skeletons inicialmente
          />
        </div>
      );
    }

    if (error) {
      return (
        <div className="center-content error">
          <p>{error}</p>
        </div>
      );
    }

    if (phrases.length === 0) {
      return (
        <div className="center-content">
          <p>No hay frases disponibles</p>
          <IonButton onClick={() => openEditModal()}>
            <IonIcon icon={addOutline} slot="start" />
            Añadir Nueva Frase
          </IonButton>
        </div>
        
      );
    }

    return (
      <div ref={containerRef}>
        <div className="add-button-container">
          <IonFabButton className=".ion-button" onClick={() => openEditModal()}>
            <IonIcon  icon={addOutline} />
          </IonFabButton>
        </div>
      
        <PhraseSearchControls
          phrases={phrases}
          onSearch={performSearch} // Ahora performSearch está disponible
          onSortChange={handleSortChange}
          currentSort={sortConfig}
          viewType={viewType}
          
          /* onViewChange={setViewType} */
          
          
          onViewChange={handleViewTypeChange}

          displayedCount={phrases.length}
          totalCount={totalPhrases}
          isFiltered={isSearchActive} onClearSearch={function (): void {
            throw new Error("Function not implemented.");
          } } isSearchActive={false} isLoading={false}      />



        <PhraseList
          phrases={sortedPhrases}
          design={selectedDesign}
          viewType={viewType}
          onEdit={openEditModal}
          onDelete={deletePhrase}
          isLoading={isLoading}
        />
        {isLoading && (
          <div className="loading-more">
            <PhraseSkeleton
              viewType={viewType}
              design={selectedDesign}
              count={3}
            />
          </div>
        )}
      </div>
    );
  };

  return (
      <Layout title="Frases">
        <IonContent>
          <IonToolbar>
            <div className="center-title">
              <IonTitle className="center-title">
                Frases célebres, pensamientos, palabras y citas de la vida.
              </IonTitle>
            </div>
          </IonToolbar>
    
          {/* Solo mostrar PhraseStats cuando phrases está definido */}
          {phrases && phrases.length > 0 && 
            <PhraseStats 
              phrases={phrases}
              viewType={viewType}
              onViewChange={setViewType} 
              displayedCount={phrases.length} 
              totalCount={totalPhrases} 
              isFiltered={isSearchActive}    
            />
          }
          {renderContent()}
    
          <IonInfiniteScroll
            onIonInfinite={handleInfiniteScroll}
            threshold="100px"
            disabled={!hasMore || isLoading}
            position="bottom"
            className="infinite-scroll-custom"
          >
            <IonInfiniteScrollContent 
              loadingSpinner="crescent"
              loadingText="Cargando más frases..."
            >
              {isLoading && <div style={{height: "20px" }} />}
              <div className="load-progress " >
                {`${
                  phrases.length
                } de ${totalPhrases} frases cargadas (${Math.round(
                  (phrases.length / totalPhrases) * 100
                )}%)`}
              </div>
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
    
        <PhraseModal
          isOpen={isModalOpen}
          phrase={currentPhrase}
          onClose={closeModal}
          onSave={savePhrase}
        />
      </Layout>
    );
};

export default PhrasePage;