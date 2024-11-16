// frontend/src/components/PhraseItem.tsx
import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonChip,
  IonModal,
  IonHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonAlert
} from "@ionic/react";
import {
  pencil,
  trash,
  heart,
  chevronBack,
  chevronForward,
  ellipsisVertical,
  expand,
  bookmark,
  share,
} from "ionicons/icons";
import { Phrase } from "../types/Phrase";
import { CardDesign } from "../types/CardDesign";
import "./PhraseItem.css";
import CopyButton from "./CopyButton";
import FloatingCardPhraseButtons from "./FloatingCardPhraseButtons";
import { Clipboard } from "@capacitor/clipboard";

interface PhraseItemProps {
  phrase: Phrase;
  onEdit: (phrase: Phrase) => void; // Especificar que recibe una frase
  onDelete: (id: number) => Promise<void>;
  design: CardDesign;
}

interface PhraseModalProps {
  phrase: Phrase;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}



const PhraseDetailModal: React.FC<PhraseModalProps> = ({
  phrase,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => (
  <IonModal isOpen={isOpen} onDidDismiss={onClose}>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={onPrevious}>
            <IonIcon icon={chevronBack} />
          </IonButton>
        </IonButtons>
        <IonTitle>#{phrase.id}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={onNext}>
            <IonIcon icon={chevronForward} />
          </IonButton>
          <IonButton onClick={onClose}>
            <IonIcon icon={chevronForward} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div className="modal-content">
        <h2>{phrase.text}</h2>
        <p className="author">— {phrase.author}</p>
        {phrase.reflection && (
          <div className="reflection">
            <h3>Reflexión</h3>
            <p>{phrase.reflection}</p>
          </div>
        )}
        {phrase.historical_context && (
          <div className="historical-context">
            <h3>Contexto Histórico</h3>
            <p>{phrase.historical_context}</p>
          </div>
        )}
        {/* Más campos */}
        {phrase.category && (
          <div className="historical-context">
            <h3>Categoría</h3>
            <p>{phrase.category}</p>
          </div>
        )}

        {phrase.career && (
          <div className="historical-context">
            <h3>Carrera</h3>
            <p>{phrase.career}</p>
          </div>
        )}
      </div>
    </IonContent>
  </IonModal>
);

const PhraseItem: React.FC<PhraseItemProps> = ({
  phrase,
  onEdit,
  onDelete,
  design,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFirstAlert, setShowFirstAlert] = useState(false);
  const [showSecondAlert, setShowSecondAlert] = useState(false);
  const ActionButtons = () => (
    <IonFab vertical="bottom" horizontal="start" slot="fixed">
      <IonFabButton size="small">
        <IonIcon icon={ellipsisVertical} />
      </IonFabButton>
      <IonFabList side="bottom">
        <IonFabButton onClick={() => setIsModalOpen(true)}>
          <IonIcon icon={expand} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={pencil} />
        </IonFabButton>
        <IonFabButton color="danger">
          <IonIcon icon={trash} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={heart} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={bookmark} />
        </IonFabButton>
        <IonFabButton>
          <IonIcon icon={share} />
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );

  const IdBadge = () => <div className="phrase-id-badge">#{phrase.id}</div>;

  const shareText = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Texto para compartir",
          text: text,
          url: window.location.href, // O puedes omitir esta parte si no quieres compartir una URL.
        });
        console.log("Texto compartido correctamente");
      } catch (error) {
        console.error("Error al intentar compartir:", error);
      }
    } else {
      console.error("La API Web Share no es compatible en este dispositivo");
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    onEdit(phrase);
  };

  // Función para mostrar la primera alerta de confirmación
  const handleDelete = (e: React.MouseEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    setShowFirstAlert(true); // Mostrar primera alerta de confirmación
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = () => {
    setShowFirstAlert(false);
    setShowSecondAlert(true);  // Mostrar la segunda alerta de confirmación
  };

  // Función para proceder con la eliminación
  const handleFinalDelete = () => {
    onDelete(phrase.id);  // Eliminar la frase
    setShowSecondAlert(false);  // Cerrar la segunda alerta
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowFirstAlert(false);
    setShowSecondAlert(false);  // Cerrar ambas alertas si el usuario cancela
    console.log('Eliminación cancelada');
  };
  

  const renderClassicDesign = () => (
    <IonCard
      className={`custom-card classic-card ${phrase.category?.toLowerCase()}`}
    >
      <div className="button-container">
        <IonButton fill="clear" onClick={() => setIsModalOpen(true)}>
          <IonIcon icon={expand} />
        </IonButton>
    {/* Primera alerta: Confirmación de eliminación */}
    <IonAlert
        isOpen={showFirstAlert}
        onDidDismiss={() => setShowFirstAlert(false)}
        header="Confirmar eliminación"
        message="¿Estás seguro de que quieres borrar esta frase?"
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: handleCancelDelete,  // Cancelar todo
          },
          {
            text: 'Eliminar',
            handler: handleConfirmDelete,  // Mostrar segunda alerta
          },
        ]}
      />

      {/* Segunda alerta: Confirmación final */}
      <IonAlert
        isOpen={showSecondAlert}
        onDidDismiss={() => setShowSecondAlert(false)}
        header="Confirmación final"
        message="Has elegido eliminar esta frase, ¿sí o no?"
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: handleCancelDelete,  // Si el usuario elige 'No', cancelar todo
          },
          {
            text: 'Sí',
            handler: handleFinalDelete,  // Proceder con la eliminación
          },
        ]}
      />
        <IonButton fill="clear">
        
        <IonButton fill="clear" onClick={handleEdit}>
          <IonIcon icon={pencil} color="success" />
        </IonButton>
          
        <IonButton fill="clear" onClick={handleDelete}>
          <IonIcon icon={trash} color="danger" />
        </IonButton>
          {/* #{phrase.id} */}
          <CopyButton text={phrase.text} author={phrase.author} />
        </IonButton>

        <IonButton fill="clear">
          <IonIcon icon={heart} />
        </IonButton>
        
      </div>



      <IonCardHeader>
        <IonCardTitle>{phrase.text}</IonCardTitle>

        {phrase.author && (
          <p className="author">
            — {phrase.author} {phrase.alias ? `(${phrase.alias})` : ""}
          </p>
        )}

        <div className="tags">
          {phrase.tags?.es?.map((tag: string, index: number) => (
            <IonChip key={index}>{tag}</IonChip>
          ))}
        </div>
      </IonCardHeader>

      <PhraseDetailModal
        phrase={phrase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={() => {
          /* Implementar navegación */
        }}
        onPrevious={() => {
          /* Implementar navegación */
        }}
      />
    </IonCard>
  );

  const renderModernDesign = () => (
    <IonCard className="modern-card">
      <IdBadge />
      <div className="card-header">
        <IonIcon icon={heart} className="favorite-icon" />
      </div>
      <div className="card-content">
        <h2 className="quote-text">{phrase.text}</h2>
        {phrase.author && <p className="author-text">— {phrase.author}</p>}
        <div className="tags-container">
          {phrase.tags?.es?.map((tag: string, index: number) => (
            <IonChip key={index} className="modern-chip">
              {tag}
            </IonChip>
          ))}
        </div>
        <div className="action-buttons modern-buttons">
          <IonButton fill="clear" onClick={handleEdit}>
            <IonIcon icon={pencil} />
          </IonButton>
          <IonButton fill="clear" color="danger" onClick={handleDelete}>
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );

  const renderGradientDesign = () => (
    <IonCard className="gradient-card">
      <IdBadge />
      <div className="gradient-overlay">
        <div className="quote-content">
          <h2 className="gradient-quote">{phrase.text}</h2>
          {phrase.author && (
            <p className="gradient-author">— {phrase.author}</p>
          )}
          <div className="gradient-tags">
            {phrase.tags?.es?.map((tag: string, index: number) => (
              <span key={index} className="gradient-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="gradient-buttons">
          <IonButton fill="clear" color="light" onClick={handleEdit}>
            <IonIcon icon={pencil} />
          </IonButton>
          <IonButton fill="clear" color="light" onClick={handleDelete}>
            <IonIcon icon={trash} />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );

  const renderMinimalDesign = () => (
    <IonCard className="minimal-card">
      <IdBadge />
      <div className="minimal-content">
        <blockquote className="minimal-quote">
          <p>{phrase.text}</p>
          {phrase.author && <footer>— {phrase.author}</footer>}
        </blockquote>
        <div className="minimal-tags">
          {phrase.tags?.es?.map((tag: string, index: number) => (
            <small key={index} className="minimal-tag">
              {tag}
            </small>
          ))}
        </div>
        <div className="minimal-actions">
          <IonButton fill="clear" size="small" onClick={handleEdit}>
            <IonIcon icon={pencil} slot="icon-only" />
          </IonButton>
          <IonButton
            fill="clear"
            size="small"
            color="danger"
            onClick={handleDelete}
          >
            <IonIcon icon={trash} slot="icon-only" />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );

  const designMap = {
    [CardDesign.CLASSIC]: renderClassicDesign,
    [CardDesign.MODERN]: renderModernDesign,
    [CardDesign.GRADIENT]: renderGradientDesign,
    [CardDesign.MINIMAL]: renderMinimalDesign,
  };

  return designMap[design]();
};

export default PhraseItem;
