// frontend/src/pages/Home.tsx
import React from "react";
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import {
  star,
  heart,
  sparkles,
  home,
  personCircle,
  notifications,
  settings,
  call,
  mail,
  add,
  remove,
  share,
} from "ionicons/icons";

import { MenuItem } from "../types/MenuItem";
import "./Home.css";
import AppBar from '../components/layout/AppBar';


import Layout from '../components/layout/Layout';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard,
  faClipboardList,
  faQuoteLeft,
  faQuoteRight,
  faVrCardboard,
} from "@fortawesome/free-solid-svg-icons";



const menuItems: MenuItem[] = [
  { icon: home, text: "Inicio", url: "/home" },
  { icon: personCircle, text: "Perfil", url: "/dashboard" },
  { icon: notifications, text: "Notificaciones", url: "/notifications" },
  { icon: settings, text: "Configuración", url: "/settings" },
];

const Home: React.FC = () => {
  
  const fabButtons = [
    { icon: call, label: "Llamar", onClick: () => console.log("Call clicked") },
    { icon: mail, label: "Correo", onClick: () => console.log("Mail clicked") },
    { icon: settings, label: "Ajustes", onClick: () => console.log("Settings clicked") },
    { icon: add, onClick: () => console.log("Add clicked") },
    { icon: remove, onClick: () => console.log("Remove clicked") },
    { icon: star, onClick: () => console.log("Star clicked") },
    { icon: heart, onClick: () => console.log("Heart clicked") },
    { icon: share, onClick: () => console.log("Share clicked") },
  ];





  return (
    

        
        <Layout title="Inicio"> 
          {/* <ExpandableFab buttons={fabButtons} vertical={true} /> */}

          <div className="feature-grid">
            <IonCard style={{ backgroundColor: "white" }}>
              <IonCardHeader style={{ textAlign: "center", color: "" }}>
                <IonCardTitle>Frases célebres, pensamientos, palabras y citas de la vida <FontAwesomeIcon icon={faQuoteRight} /></IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                ¡Inspírate! Gestiona tus favoritas.
              </IonCardContent>
              <IonButton
                routerLink="/phrases"
                expand="block"
                color="secondary"
                className="ion-margin"
              >
                Acceder&nbsp;
                <FontAwesomeIcon icon={faQuoteRight} />
              </IonButton>
            </IonCard>

        
          </div>
          <IonContent>
 
    {/* Resto de tu contenido */}
  </IonContent>
          </Layout>

    
  );
};

export default Home;
