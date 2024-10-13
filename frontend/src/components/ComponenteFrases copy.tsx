import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonChip,
  IonFab,
  IonFabButton,
  IonFabList,
  IonInput
} from "@ionic/react";
import { gridOutline, pencil, trash, save } from "ionicons/icons";
import './ComponenteFrases.css';

interface Cita {
  id: number;
  texto: string;
  autor: string;
  etiquetas: string[];
}

const ComponenteFrases: React.FC = () => {
  const [isGrid, setIsGrid] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCita, setEditingCita] = useState<number | null>(null);
  const [citasFrases, setCitasFrases] = useState<Cita[]>([
    { id: 1, texto: "El conocimiento es poder.", autor: "Francis Bacon", etiquetas: ["Conocimiento", "Poder", "Sabiduría"] },
    { id: 2, texto: "La vida es aquello que te sucede mientras estás ocupado haciendo otros planes.", autor: "John Lennon", etiquetas: ["Vida", "Destino", "Reflexión"] },
    { id: 3, texto: "No es la más fuerte de las especies la que sobrevive, ni la más inteligente, sino la que responde mejor al cambio.", autor: "Charles Darwin", etiquetas: ["Evolución", "Cambio", "Supervivencia"] },
    { id: 4, texto: "El único modo de hacer un gran trabajo es amar lo que haces.", autor: "Steve Jobs", etiquetas: ["Trabajo", "Pasión", "Éxito"] },
  ]);

  const [editedText, setEditedText] = useState("");

  const filteredCitas = citasFrases.filter(cita =>
    cita.etiquetas.some(etiqueta =>
      etiqueta.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEditCita = (cita: Cita) => {
    setEditingCita(cita.id);
    setEditedText(cita.texto);
  };

  const handleSaveCita = async (id: number) => {
    console.log(`Guardar cita con id: ${id}, nuevo texto: ${editedText}`);

    const updatedCitas = citasFrases.map((cita) =>
      cita.id === id ? { ...cita, texto: editedText } : cita
    );
    setCitasFrases(updatedCitas);
    setEditingCita(null);
    setEditedText("");
  };

  const handleDeleteCita = async (id: number) => {
    console.log(`Eliminar cita con id: ${id}`);

    const remainingCitas = citasFrases.filter(cita => cita.id !== id);
    setCitasFrases(remainingCitas);
  };

  return (
    <IonContent className="ion-padding">
      <IonItem>
        <IonLabel position="stacked">Buscar por etiquetas:</IonLabel>
        <IonInput
          value={searchTerm}
          placeholder="Buscar etiquetas..."
          onIonChange={(e) => setSearchTerm(e.detail.value!)}
        />
      </IonItem>

      <IonItem lines="none" className="header-item">
        <IonLabel>{isGrid ? "Vista de Cuadrícula" : "Vista de Lista"}</IonLabel>
        <IonButton fill="clear" onClick={() => setIsGrid(!isGrid)}>
          <IonIcon icon={isGrid ? "list-outline" : "grid-outline"} style={{ fontSize: "24px" }} />
        </IonButton>
      </IonItem>

      <IonGrid className={isGrid ? "grid-view" : "list-view"}>
        <IonRow>
          {filteredCitas.map((cita) => (
            <IonCol key={cita.id} size={isGrid ? "6" : "12"}>
              <IonCard className="custom-card" style={{ background: getRandomGradient(), position: "relative" }}>
                <IonCardHeader>
                  <div className="etiquetas">
                    {cita.etiquetas.map((etiqueta, index) => (
                      <IonChip key={index} className="chip">{etiqueta}</IonChip>
                    ))}
                  </div>

                  {editingCita === cita.id ? (
                    <IonInput
                      value={editedText}
                      onIonChange={(e) => setEditedText(e.detail.value!)}
                    />
                  ) : (
                    <IonCardTitle>{cita.texto}</IonCardTitle>
                  )}
                  <p className="author">— {cita.autor}</p>

                  {/* IonFab ahora se posiciona dentro de cada cita */}
                  <IonFab vertical="center" horizontal="end" style={{ position: "absolute", right: "10px", top: "0px", zIndex: 99 }}>
                    <IonFabButton size="small">
                      <IonIcon icon={gridOutline} />
                    </IonFabButton>
                    <IonFabList side="start">
                      {editingCita === cita.id ? (
                        <IonFabButton onClick={() => handleSaveCita(cita.id)}>
                          <IonIcon icon={save} />
                        </IonFabButton>
                      ) : (
                        <IonFabButton onClick={() => handleEditCita(cita)}>
                          <IonIcon icon={pencil} />
                        </IonFabButton>
                      )}
                      <IonFabButton color="danger" onClick={() => handleDeleteCita(cita.id)}>
                        <IonIcon icon={trash} />
                      </IonFabButton>
                    </IonFabList>
                  </IonFab>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

// Función para generar un degradado aleatorio
const getRandomGradient = () => {
  const colors = [
    "rgba(255, 182, 193, 0.5)", 
    "rgba(173, 216, 230, 0.5)", 
    "rgba(144, 238, 144, 0.5)", 
    "rgba(240, 230, 140, 0.5)", 
    "rgba(255, 228, 196, 0.5)", 
    "rgba(221, 160, 221, 0.5)", 
    "rgba(250, 250, 210, 0.5)", 
    "rgba(224, 255, 255, 0.5)", 
    "rgba(255, 239, 213, 0.5)", 
    "rgba(245, 245, 220, 0.5)"  
  ];

  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(45deg, ${randomColor1}, ${randomColor2})`;
};

export default ComponenteFrases;
