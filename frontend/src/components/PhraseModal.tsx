// frontend/src/components/PhraseModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  IonModal,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonChip,
  IonSpinner,
} from "@ionic/react";
import {
  close,
  save,
  image,
  text,
  information,
  person,
  closeCircle,
} from "ionicons/icons";
import { Phrase, PhraseFormData } from "../types/Phrase";
import "./PhraseModal.css";
import ImageCapture from "./ImageCapture";

import { Camera } from "@capacitor/camera";
import { camera, images } from "ionicons/icons";
import { Photo } from "@capacitor/camera";
import { photoService } from "../services/photo.service";
import { toastService } from "../services/toast.service";

interface PhraseModalProps {
  isOpen: boolean;
  phrase: Phrase | null;
  onClose: () => void;
  onSave: (phrase: Partial<Phrase>) => void;
}

// Primero define el tipo de props que acepta IonInput
interface Props extends React.ComponentProps<typeof IonInput> {
  placeholder: string;
  onIonKeyDown: (e: CustomEvent<KeyboardEvent>) => void;
  "clear-on-edit": boolean;
}

const PhraseModal: React.FC<PhraseModalProps> = ({
  isOpen,
  phrase,
  onClose,
  onSave,
}) => {
  const [phraseText, setPhraseText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [activeSegment, setActiveSegment] = useState("basic");
  const [tagArray, setTagArray] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = useRef<any>(null);

  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  

  const handleTakePhoto = async () => {
    try {
      console.log("📸 Iniciando captura de foto...");
      setIsUploadingImage(true);

      const photo = await photoService.takePhoto();
      console.log("📸 Foto capturada:", photo);

      if (photo.webPath) {
        console.log("📸 WebPath disponible:", photo.webPath);
        setImageFile(photo.webPath);
        setCurrentPhoto(photo);
      } else if (photo.base64String) {
        console.log("📸 Base64 disponible");
        setImageFile(`data:image/jpeg;base64,${photo.base64String}`);
        setCurrentPhoto(photo);
      }
    } catch (error) {
      console.error("❌ Error al tomar la foto:", error);
      toastService.error("Error al tomar la foto");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log("🖼️ Iniciando selección de imagen...");
      setIsUploadingImage(true);

      const photo = await photoService.pickImage();
      console.log("🖼️ Imagen seleccionada:", photo);

      if (photo.webPath) {
        console.log("🖼️ WebPath disponible:", photo.webPath);
        setImageFile(photo.webPath);
        setCurrentPhoto(photo);
      } else if (photo.base64String) {
        console.log("🖼️ Base64 disponible");
        setImageFile(`data:image/jpeg;base64,${photo.base64String}`);
        setCurrentPhoto(photo);
      }
    } catch (error) {
      console.error("❌ Error al seleccionar la imagen:", error);
      toastService.error("Error al seleccionar la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Función para manejar el arrastre
  const initDrag = (e: React.MouseEvent) => {
    const modal = dragRef.current?.closest(".ion-modal") as HTMLElement;
    if (!modal) return;

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (e: MouseEvent) => {
      if (!isExpanded) {
        setPosition({
          x: e.clientX - startX,
          y: e.clientY - startY,
        });
        modal.style.transform = `translate(${e.clientX - startX}px, ${
          e.clientY - startY
        }px)`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    if (phrase) {
      const formState = {
        text: phrase.text || "",
        author: phrase.author || "",
        category: phrase.category || "",
        tagArray: phrase.tags?.es || [],
        imageFile: phrase.filename,
      };

      setPhraseText(formState.text);
      setAuthor(formState.author);
      setCategory(formState.category);
      setTagArray(formState.tagArray);
      setImageFile(formState.imageFile);

      initialFormState.current = formState;
    } else {
      const emptyState = {
        text: "",
        author: "",
        category: "",
        tagArray: [],
        imageFile: null,
      };

      setPhraseText("");
      setAuthor("");
      setCategory("");
      setTagArray([]);
      setImageFile(null);

      initialFormState.current = emptyState;
    }
  }, [phrase]);

  const hasChanges = () => {
    const currentState = {
      text: phraseText,
      author,
      category,
      tagArray,
      imageFile,
    };

    return Object.keys(currentState).some(
      (key) =>
        currentState[key as keyof typeof currentState] !==
        initialFormState.current[key as keyof typeof initialFormState.current]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      setTagArray([...tagArray, e.currentTarget.value.toString().trim()]);
      e.currentTarget.value = "";
    }
  };

  const handleAddTag = (event: KeyboardEvent) => {
    const input = event.target as HTMLIonInputElement;
    if (input.value && event.key === "Enter") {
      setTagArray([...tagArray, input.value.toString().trim()]);
      input.value = "";
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTagArray(tagArray.filter((_, index) => index !== indexToRemove));
  };

  const handleSegmentChange = (event: CustomEvent) => {
    setActiveSegment(event.detail.value);
  };

  const handleTextChange = (event: CustomEvent) => {
    setPhraseText(event.detail.value || "");
  };

  const handleAuthorChange = (event: CustomEvent) => {
    setAuthor(event.detail.value || "");
  };

  const handleCategoryChange = (event: CustomEvent) => {
    setCategory(event.detail.value || "");
  };

  const handleSave = async () => {
    try {
      if (!phraseText.trim()) {
        toastService.error("El texto de la frase es obligatorio");
        return;
      }

      setIsSubmitting(true);

      // Preparar los datos de la frase
      const phraseData: PhraseFormData = {
        text: phraseText,
        author,
        category,
        tags: { es: tagArray },
      };

      // Si hay una foto nueva, añadirla a los datos
      if (currentPhoto) {
        console.log("📤 Preparando imagen para subir:", currentPhoto);
        phraseData.photo = currentPhoto;
      }

      await onSave(phraseData);
      toastService.success("Frase guardada correctamente");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      toastService.error("Error al guardar la frase");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className={`custom-modal ${isExpanded ? "expanded" : ""}`}
    >
      <div
        ref={dragRef}
        className="draggable-header"
        onMouseDown={initDrag}
      ></div>

      <IonToolbar>
        <IonTitle>{phrase ? "Editar Frase" : "Nueva Frase"}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => setIsExpanded(!isExpanded)}>
            <IonIcon icon={isExpanded ? "contract" : "expand"} />
          </IonButton>
          <IonButton onClick={onClose}>
            <IonIcon icon={close} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonToolbar>
        <IonSegment value={activeSegment} onIonChange={handleSegmentChange}>
          <IonSegmentButton value="basic">
            <IonIcon icon={text} />
            <IonLabel>Básico</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="author">
            <IonIcon icon={person} />
            <IonLabel>Autor</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="media">
            <IonIcon icon={image} />
            <IonLabel>Media</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="extra">
            <IonIcon icon={information} />
            <IonLabel>Extra</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>

      <IonContent className="ion-padding">
        {activeSegment === "basic" && (
          <>
            <IonItem>
              <IonLabel position="stacked">Texto</IonLabel>
              <IonTextarea
                value={phraseText}
                onIonChange={handleTextChange}
                placeholder="Texto de la frase"
                autoGrow={true}
                className="custom-textarea"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Categoría</IonLabel>
              <IonSelect value={category} onIonChange={handleCategoryChange}>
                <IonSelectOption value="filosofía">Filosofía</IonSelectOption>
                <IonSelectOption value="ciencia">Ciencia</IonSelectOption>
                <IonSelectOption value="literatura">Literatura</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Etiquetas</IonLabel>
              <IonInput
                placeholder="Presiona Enter para añadir"
                onKeyDown={handleKeyDown}
                clearOnEdit={true}
              />
            </IonItem>

            <div className="tag-container">
              {tagArray.map((tag, index) => (
                <IonChip key={index} onClick={() => handleRemoveTag(index)}>
                  {tag}
                  <IonIcon icon={closeCircle} />
                </IonChip>
              ))}
            </div>
          </>
        )}

        {activeSegment === "author" && (
          <IonItem>
            <IonLabel position="stacked">Autor</IonLabel>
            <IonInput
              value={author}
              onIonChange={handleAuthorChange}
              placeholder="Nombre del autor"
            />
          </IonItem>
        )}

        {activeSegment === "media" && (
          <div className="ion-padding">
            {isUploadingImage && (
              <div className="loading-overlay">
                <IonSpinner />
                <p>Procesando imagen...</p>
              </div>
            )}

            {imageFile && (
              <div className="image-preview">
                <img
                  src={imageFile}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onError={(e) => {
                    console.error("❌ Error al cargar la imagen preview:", e);
                    toastService.error("Error al mostrar la imagen");
                  }}
                />
              </div>
            )}

            <div className="ion-margin-vertical">
              <IonButton onClick={handleTakePhoto} disabled={isUploadingImage}>
                <IonIcon slot="start" icon={camera} />
                {isUploadingImage ? "Procesando..." : "Tomar Foto"}
              </IonButton>

              <IonButton onClick={handlePickImage} disabled={isUploadingImage}>
                <IonIcon slot="start" icon={images} />
                {isUploadingImage ? "Procesando..." : "Seleccionar Imagen"}
              </IonButton>
            </div>
          </div>
        )}

        {activeSegment === "extra" && (
          // Contenido para la pestaña extra
          <div>Contenido Extra</div>
        )}
      </IonContent>

      <div className="modal-footer">
        <IonButton
          expand="block"
          onClick={handleSave}
          disabled={
            isSubmitting ||
            (phrase && !phrase.is_editable) ||
            !phraseText.trim()
          }
        >
          <IonIcon icon={save} slot="start" />
          {isSubmitting ? "Guardando..." : "Guardar"}
        </IonButton>
      </div>
    </IonModal>
  );
};

export default PhraseModal;
