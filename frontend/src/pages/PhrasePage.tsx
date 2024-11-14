// frontend/src/pages/PhrasePage.tsx
import React, { useRef, useState, useMemo } from "react";
import PhraseSortControls from '../components/PhraseSortControls';
import type { SortField, SortOrder } from '../components/PhraseSortControls';
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
} from "@ionic/react";

import {
  gridOutline,
  listOutline,
  cardOutline,
  appsOutline,
  addOutline,
} from "ionicons/icons";
import { CardDesign } from "../types/CardDesign";
import { usePhraseController } from "../controllers/usePhraseController";
import Layout from "../components/layout/Layout";
import PhraseList from "../components/PhraseList";
import PhraseModal from "../components/PhraseModal";
import PhraseSkeleton from "../components/PhraseSkeleton";
import "./PhrasePage.css";
import { InfiniteScrollCustomEvent } from "@ionic/core";
import ViewToggleButton from "../components/ViewToggleButton";
import PhraseStats from "../components/PhraseStats";

const PhrasePage: React.FC = () => {
  const [selectedDesign, setSelectedDesign] = useState<CardDesign>(
    CardDesign.CLASSIC
  );
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const toggleView = () => {
    setViewType((currentView) => (currentView === "grid" ? "list" : "grid"));
  };

  // Función para obtener el icono y texto opuesto a la vista actual
  const getToggleIcon = () => {
    return viewType === "list" ? gridOutline : listOutline;
  };
  const getToggleText = () => {
    return viewType === "list"
      ? "Cambiar a vista cuadrícula"
      : "Cambiar a vista lista";
  };

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
    totalPhrases
  } = usePhraseController();


    // Crear un ref para el contenedor de frases
    const containerRef = useRef<HTMLDivElement | null>(null);

// En PhrasePage.tsx

const handleInfiniteScroll = async (e: InfiniteScrollCustomEvent) => {
  console.log('🔄 Scroll triggered:', {
    loaded: phrases.length,
    total: totalPhrases,
    hasMore,
    isLoading
  });

  try {
    if (isLoading || !hasMore) {
      console.log('⏹️ Scroll blocked:', { isLoading, hasMore });
      e.target.complete();
      return;
    }

    await loadMorePhrases();
    console.log('✅ Load more completed');
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
    field: 'id',
    order: 'asc'
  });

 // Ordenar frases
 const sortedPhrases = useMemo(() => {
  if (!phrases) return [];
  
  return [...phrases].sort((a, b) => {
    const compareValue = (val1: any, val2: any) => {
      if (val1 === null || val1 === undefined) return 1;
      if (val2 === null || val2 === undefined) return -1;
      if (typeof val1 === 'string') return val1.localeCompare(val2);
      return val1 - val2;
    };

    let comparison = 0;
    switch (sortConfig.field) {
      case 'id':
        comparison = compareValue(a.id, b.id);
        break;
      case 'author':
        comparison = compareValue(a.author, b.author);
        break;
      case 'createdAt':
        comparison = compareValue(new Date(a.created_at), new Date(b.created_at));
        break;
      case 'category':
        comparison = compareValue(a.category, b.category);
        break;
      default:
        comparison = compareValue(a.id, b.id);
    }

    return sortConfig.order === 'asc' ? comparison : -comparison;
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
      <>
           <div className="phrases-info">
        Mostrando {phrases.length} de {totalPhrases} frases
        {isLoading && <span> (Cargando más...)</span>}
      </div>

        <div className="add-button-container">
          <IonButton onClick={() => openEditModal()}>
            <IonIcon icon={addOutline} slot="start" />
            Nueva Frase
          </IonButton>
        </div>

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
    </>
    );
  };

  return (
    <Layout>
      <IonToolbar>
        <IonTitle>
          Frases célebres, pensamientos, palabras y citas de la vida.
        </IonTitle>
      </IonToolbar>
      <IonToolbar>
        <IonSegment
          value={selectedDesign}
          onIonChange={(e) => setSelectedDesign(e.detail.value as CardDesign)}
        >
          <IonSegmentButton value={CardDesign.CLASSIC}>
            <IonIcon icon={cardOutline} />
            <IonLabel>Clásico</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={CardDesign.MODERN}>
            <IonIcon icon={appsOutline} />
            <IonLabel>Moderno</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={CardDesign.GRADIENT}>
            <IonIcon icon={gridOutline} />
            <IonLabel>Gradiente</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={CardDesign.MINIMAL}>
            <IonIcon icon={listOutline} />
            <IonLabel>Minimal</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonButtons slot="end" className="view-toggle-buttons">
          <IonButton
            onClick={toggleView}
            className="view-toggle-btn"
            title={getToggleText()} // Usando title nativo en lugar de IonTooltip
            aria-label={getToggleText()} // Añadiendo aria-label para accesibilidad
          >
            <IonIcon icon={getToggleIcon()} className="toggle-icon" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    {/* Solo mostrar PhraseStats cuando phrases está definido */}
    {phrases && phrases.length > 0 && (
      <PhraseStats phrases={phrases} />
    )}
          <PhraseSortControls
        currentSort={sortConfig}
        onSortChange={handleSortChange}
      />
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
          {isLoading && <div style={{ height: "20px" }} />}
          <div className="load-progress">
  {`${phrases.length} de ${totalPhrases} frases cargadas (${Math.round((phrases.length/totalPhrases)*100)}%)`}
</div>
        </IonInfiniteScrollContent>
      </IonInfiniteScroll>


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
