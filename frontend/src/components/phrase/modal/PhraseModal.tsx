// frontend/src/components/phrase/modal/PhraseModal.tsx
import React, { useState, useRef } from "react";
import { IonModal, IonButtons, IonButton, IonIcon, IonSegment, IonSegmentButton } from "@ionic/react";
import { close, text, person, image, information } from "ionicons/icons";
import { Phrase, PhraseFormData } from "../../../types/Phrase";
import  useFormValidation  from "./hooks/useFormValidation";
import  useImageHandling  from "./hooks/useImageHandling";
import  useModalDrag  from "./hooks/useModalDrag";
import  ModalHeader  from "./components/ModalHeader";
import  ModalFooter  from "./components/ModalFooter";
import  BasicSection  from "./sections/BasicSection";
import  AuthorSection  from "./sections/AuthorSection";
import  MediaSection  from "./sections/MediaSection";
import  ExtraSection  from "./sections/ExtraSection";

interface PhraseModalProps {
  isOpen: boolean;
  phrase: Phrase | null;
  onClose: () => void;
  onSave: (phrase: Partial<Phrase>) => void;
}

const PhraseModal: React.FC<PhraseModalProps> = ({
  isOpen,
  phrase,
  onClose,
  onSave,
}) => {
  const [activeSegment, setActiveSegment] = useState("basic");
  const [isExpanded, setIsExpanded] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const {
    phraseText,
    author,
    category,
    tagArray,
    imageFile,
    isSubmitting,
    hasChanges,
    handleSubmit,
    setPhraseText,
    setAuthor,
    setCategory,
    setTagArray,
    setImageFile,
} = useFormValidation(phrase, async (phraseData: PhraseFormData) => {
    await onSave(phraseData);
  });

  const { position, initDrag } = useModalDrag(dragRef);

  const handleSegmentChange = (event: CustomEvent) => {
    setActiveSegment(event.detail.value);
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className={`custom-modal ${isExpanded ? "expanded" : ""}`}
    >
      <div ref={dragRef} className="draggable-header" onMouseDown={initDrag}></div>

      <ModalHeader
        title={phrase ? "Editar Frase" : "Nueva Frase"}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onClose={onClose}
      />

      <IonSegment value={activeSegment} onIonChange={handleSegmentChange}>
        <IonSegmentButton value="basic">
          <IonIcon icon={text} />
          <span>Básico</span>
        </IonSegmentButton>
        <IonSegmentButton value="author">
          <IonIcon icon={person} />
          <span>Autor</span>
        </IonSegmentButton>
        <IonSegmentButton value="media">
          <IonIcon icon={image} />
          <span>Media</span>
        </IonSegmentButton>
        <IonSegmentButton value="extra">
          <IonIcon icon={information} />
          <span>Extra</span>
        </IonSegmentButton>
      </IonSegment>

      {activeSegment === "basic" && (
        <BasicSection
          phrase={phrase}
          onPhraseTextChange={setPhraseText}
          onCategoryChange={setCategory}
          onTagArrayChange={setTagArray}
        />
      )}

      {activeSegment === "author" && (
        <AuthorSection phrase={phrase} onAuthorChange={setAuthor} />
      )}

      {activeSegment === "media" && (
        <MediaSection
          phrase={phrase}
          onImageChange={setImageFile}
          onUseDefaultImageChange={(useDefault) => {
            setImageFile(useDefault ? 'url_to_default_image' : null);
          }}
        />
      )}

      {activeSegment === "extra" && (
        <ExtraSection />
      )}

<ModalFooter
      onSave={handleSubmit}
      isSubmitting={isSubmitting}
      isEditable={phrase?.is_editable ?? true}
      hasChanges={hasChanges()}
    />
    </IonModal>
  );
};

export default PhraseModal;