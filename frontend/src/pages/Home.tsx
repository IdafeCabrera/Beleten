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



import Layout from '../components/layout/Layout';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard,
  faClipboardList,
  faQuoteLeft,
  faQuoteRight,
  faVrCardboard,
} from "@fortawesome/free-solid-svg-icons";
import IonCardWelcome from "../components/Cards/IonCardWelcome";
import Menu from "../components/Menu";
import Logo from "../components/Logo";
import CameraClipboardTest from "../components/CameraClipboardTest";

const menuItems: MenuItem[] = [
  { icon: home, text: "Inicio", url: "/home" },
  { icon: personCircle, text: "Perfil", url: "/profile" },
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
    

        
        <Layout>
          {/* <ExpandableFab buttons={fabButtons} vertical={true} /> */}
          <IonCardWelcome />
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

            <IonCard style={{ backgroundColor: "white" }}>
              <IonCardHeader style={{ textAlign: "center", color: "" }}>
                <IonCardTitle>
                  Todo-List{" "}
                  <FontAwesomeIcon
                    style={{ textAlign: "center", color: "" }}
                    icon={faClipboardList}
                  />
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Organizate tus tareas. -- En construcción
              </IonCardContent>
              <IonButton
                disabled={true}
                routerLink="/"
                expand="block"
                color="secondary"
                className="ion-margin"
              >
                Acceder&nbsp;
                <FontAwesomeIcon icon={faClipboardList} />
              </IonButton>
            </IonCard>

            <IonCard style={{ backgroundColor: "white" }}>
              <IonCardHeader style={{ textAlign: "center", color: "" }}>
                <IonCardTitle>Flash Cards <FontAwesomeIcon icon={faChalkboard} /></IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Tus tarjetas de conocimiento. -- En construcción
              </IonCardContent>
              <IonButton
                disabled={true}
                routerLink="/"
                expand="block"
                color="secondary"
                className="ion-margin"
              >
                Acceder&nbsp;
                <FontAwesomeIcon icon={faChalkboard} />
              </IonButton>
            </IonCard>

            <IonCard style={{ backgroundColor: "white" }}>
              <IonCardHeader style={{ textAlign: "center", color: "" }}>
                <IonCardTitle>VR <FontAwesomeIcon icon={faVrCardboard} /></IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Entra en tu Be Better virtual. -- En construcción
              </IonCardContent>
              <IonButton
                disabled={true}
                routerLink="/"
                expand="block"
                color="secondary"
                className="ion-margin"
              >
                Acceder&nbsp;
                <FontAwesomeIcon icon={faVrCardboard} />
              </IonButton>
            </IonCard>
          </div>
          <IonContent>
    <CameraClipboardTest />
    {/* Resto de tu contenido */}
  </IonContent>
          </Layout>

    
  );
};

export default Home;
