// frontend/src/pages/PhrasePage.tsx
import React, { useRef, useState } from "react";
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
  } = usePhraseController();


    // Crear un ref para el contenedor de frases
    const containerRef = useRef<HTMLDivElement | null>(null);

  const handleInfiniteScroll = async (e: InfiniteScrollCustomEvent) => {
    try {
      // Prevenir múltiples llamadas
      if (isLoading || !hasMore) {
        e.target.complete();
        return;
      }

      await loadMorePhrases();
    } catch (error) {
      console.error("Error loading more phrases:", error);
    } finally {
      e.target.complete();
    }
  };

  const renderContent = () => {
    if (isLoading && phrases.length === 0) {
      return <PhraseSkeleton 
        viewType={viewType} 
        design={selectedDesign}
      />;
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
        <div className="add-button-container">
          <IonButton onClick={() => openEditModal()}>
            <IonIcon icon={addOutline} slot="start" />
            Nueva Frase
          </IonButton>
        </div>
        <PhraseList
          phrases={phrases}
          design={selectedDesign}
          viewType={viewType}
          onEdit={openEditModal}
          onDelete={deletePhrase}
          isLoading={isLoading}
        />
        {isLoading && <PhraseSkeleton 
          viewType={viewType} 
          design={selectedDesign}
        />}
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
