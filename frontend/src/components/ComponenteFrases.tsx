import React, { useState, useEffect } from "react";
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
import { getFrases, createFrase, deleteFrase, updateFrase } from '../services/fraseService';
import './ComponenteFrases.css';

interface Cita {
  id: number;
  text: string;
  author: string;
  tags: string[];
}

const ComponenteFrases: React.FC = () => {
  const [frases, setFrases] = useState<Cita[]>([]);
  const [isGrid, setIsGrid] = useState(false); // Controla la vista (lista o cuadrícula)
  const [searchTerm, setSearchTerm] = useState(""); // Controla el término de búsqueda
  const [editingCita, setEditingCita] = useState<number | null>(null); // Controla qué cita está siendo editada
  const [editedText, setEditedText] = useState(""); // Almacena el texto editado
  
  // Estados para los nuevos campos
  const [newFrase, setNewFrase] = useState("");  // Controla el campo de texto para una nueva frase
  const [newAuthor, setNewAuthor] = useState(""); // Controla el campo de autor
  const [newTags, setNewTags] = useState(""); // Controla las etiquetas (separadas por comas)

  // 1. Función para obtener las frases de la API
  const fetchFrases = async () => {
    try {
      const fetchedFrases = await getFrases(); // Llamada a la API para obtener las frases
      setFrases(fetchedFrases);
    } catch (error) {
      console.error("Error al obtener las frases:", error);
    }
  };

  // 2. Función para crear una nueva frase
  const handleCreateFrase = async () => {
    if (newFrase && newAuthor && newTags) {
      try {
        const tagsArray = newTags.split(",").map(tag => tag.trim()); // Convierte el string de tags en un array
        const nuevaFrase = await createFrase(newFrase, newAuthor, tagsArray);
        setFrases([...frases, nuevaFrase]); // Añade la nueva frase al estado local
        // Limpiar los campos de entrada
        setNewFrase(""); 
        setNewAuthor("");
        setNewTags("");
      } catch (error) {
        console.error("Error al crear la frase:", error);
      }
    }
  };

  // 3. Función para guardar una frase editada
  const handleSaveCita = async (id: number) => {
    try {
      const updatedFrase = await updateFrase(id, { text: editedText }); // Si en tu API el campo es `text`
      
      const updatedFrases = frases.map((cita) =>
        cita.id === id ? { ...cita, text: editedText } : cita
      );
  
      setFrases(updatedFrases); // Actualiza el estado local con la cita editada
      setEditingCita(null); // Salir del modo de edición
      setEditedText(""); // Limpia el texto editado
    } catch (error) {
      console.error("Error al actualizar la frase:", error);
    }
  };

  // 4. Función para eliminar una frase
  const handleDeleteCita = async (id: number) => {
    try {
      await deleteFrase(id); // Llamada a la API para eliminar
      setFrases(frases.filter((cita) => cita.id !== id)); // Elimina la cita del estado local
    } catch (error) {
      console.error("Error al eliminar la frase:", error);
    }
  };

  // 5. Función para buscar frases por etiquetas
  const filteredCitas = frases.filter(cita =>
    cita.tags.some(tag =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Obtener las frases cuando el componente se monta
  useEffect(() => {
    fetchFrases(); // Llama a la función para obtener las frases al montar el componente
  }, []);

  return (
    <IonContent className="ion-padding">
      {/* Crear nueva frase */}
      <IonItem>
        <IonLabel position="stacked">Nueva Frase:</IonLabel>
        <IonInput
          value={newFrase}
          placeholder="Escribe la frase..."
          onIonChange={(e) => setNewFrase(e.detail.value!)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Autor:</IonLabel>
        <IonInput
          value={newAuthor}
          placeholder="Escribe el autor..."
          onIonChange={(e) => setNewAuthor(e.detail.value!)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Etiquetas (separadas por comas):</IonLabel>
        <IonInput
          value={newTags}
          placeholder="Ejemplo: Sabiduría, Conocimiento"
          onIonChange={(e) => setNewTags(e.detail.value!)}
        />
      </IonItem>
      <IonButton onClick={handleCreateFrase}>Añadir Frase</IonButton>

      {/* Input para buscar frases por etiquetas */}
      <IonItem>
        <IonLabel position="stacked">Buscar por etiquetas:</IonLabel>
        <IonInput
          value={searchTerm}
          placeholder="Buscar etiquetas..."
          onIonChange={(e) => setSearchTerm(e.detail.value!)}
        />
      </IonItem>

      {/* Cambiar entre vista de lista o cuadrícula */}
      <IonItem lines="none" className="header-item">
        <IonLabel>{isGrid ? "Vista de Cuadrícula" : "Vista de Lista"}</IonLabel>
        <IonButton fill="clear" onClick={() => setIsGrid(!isGrid)}>
          <IonIcon icon={isGrid ? "list-outline" : "grid-outline"} style={{ fontSize: "24px" }} />
        </IonButton>
      </IonItem>

      {/* Listado de citas filtradas */}
      <IonGrid className={isGrid ? "grid-view" : "list-view"}>
        <IonRow>
          {filteredCitas.map((cita) => (
            <IonCol key={cita.id} size={isGrid ? "6" : "12"}>
              <IonCard className="custom-card" style={{ background: getRandomGradient(), position: "relative" }}>
                <IonCardHeader>
                  <div className="etiquetas">
                    {cita.tags.map((tag, index) => (
                      <IonChip key={index} className="chip">{tag}</IonChip>
                    ))}
                  </div>

                  {/* Mostrar Input si se está editando, o el texto de la cita si no */}
                  {editingCita === cita.id ? (
                    <IonInput
                      value={editedText}
                      onIonChange={(e) => setEditedText(e.detail.value!)}
                    />
                  ) : (
                    <IonCardTitle>{cita.text}</IonCardTitle>
                  )}
                  <p className="author">— {cita.author}</p>

                  {/* Botones de editar y eliminar */}
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
                        <IonFabButton onClick={() => {
                          setEditingCita(cita.id);
                          setEditedText(cita.text);
                        }}>
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
