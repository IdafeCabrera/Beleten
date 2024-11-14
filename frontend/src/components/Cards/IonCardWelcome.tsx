// frontend/src/components/Cards/IonCardWelcome.tsx
import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
  IonButton,
  IonInput,
  IonItem,
} from "@ionic/react";
import {
  star,
  ellipsisHorizontal,
  logoFacebook,
  logoTwitter,
  logoInstagram,
  qrCodeOutline,
  ellipsisVertical,
} from "ionicons/icons"; // icono de QR code y redes sociales
import Confetti from "react-confetti";
import { QRCodeCanvas } from "qrcode.react";
import "./IonCardWelcome.css";

const WelcomeCard: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQR, setShowQR] = useState(false); // Estado para mostrar/ocultar el QR code
  const [email, setEmail] = useState(""); // Estado para el email

  const handleStarClick = (index: number) => {
    setRating(index);
    if (index === 5) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  const handleSubscribe = () => {
    if (email) {
      alert(`Gracias por suscribirte con el email: ${email}`);
      setEmail("");
    }
  };

  return (
    <>
      {showConfetti && <Confetti />}{" "}
      {/* Renderiza el confetti si la calificación es 5 */}
      <IonCard className="feature-card-welcome">
        {/* FAB para redes sociales en la parte superior izquierda */}
        <IonFab style={{ position: "absolute", top: "10px", right: "10px" }}>
          <IonFabButton>
            <IonIcon icon={ellipsisVertical} /> {/* Icono de tres puntos */}
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton
              color="primary"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/sharer/sharer.php?u=https://www.beleten.com",
                  "_blank"
                )
              }
            >
              <IonIcon icon={logoFacebook} />
            </IonFabButton>
            <IonFabButton
              color="primary"
              onClick={() =>
                window.open(
                  "https://twitter.com/intent/tweet?url=https://www.beleten.com",
                  "_blank"
                )
              }
            >
              <IonIcon icon={logoTwitter} />
            </IonFabButton>
            <IonFabButton
              color="primary"
              onClick={() => window.open("https://www.instagram.com", "_blank")}
            >
              <IonIcon icon={logoInstagram} />
            </IonFabButton>
          </IonFabList>
        </IonFab>

        <IonCardHeader>
          <IonCardSubtitle>Hola BeBetterian@ y/o Beletenian@</IonCardSubtitle>
          <IonCardTitle>¡ Bienvenid@ !</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <p style={{ marginBottom: "12px" }}>
            Aquí tendrás un lugar donde podrás gestionar y potenciar tus conocimientos.
          </p>

          <p style={{ marginBottom: "12px" }}>
            Explora y organiza frases ilustres o personalizadas,
            almacena tus fichas de conocimiento (flash cards), y lleva el control de tus tareas a
            otro nivel.
          </p>

          <p style={{ marginBottom: "12px" }}>
            ¡Pronto podrás ver todo en realidad virtual!
          </p>

          <h2 style={{ fontWeight: "bold", marginTop: "20px" }}>Be Better!</h2>

          {/* Estrellas de clasificación */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {[1, 2, 3, 4, 5].map((index) => (
              <IonIcon
                key={index}
                icon={star}
                style={{
                  color: index <= rating ? "#FFD700" : "#E0E0E0",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                onClick={() => handleStarClick(index)} // Evento al hacer clic
              />
            ))}
          </div>

          {/* QR Code para compartir la web */}
          <div style={{ marginTop: "20px" }}>
            <IonButton onClick={() => setShowQR(!showQR)} fill="clear">
              <IonIcon icon={qrCodeOutline} /> {/* Icono de código QR */}
            </IonButton>
            {showQR && (
              <div style={{ marginTop: "10px" }}>
                <QRCodeCanvas value="https://www.beleten.com" size={128} />
              </div>
            )}
          </div>

          {/* Input para suscribirse al Newsletter */}
          <IonItem className="custom-item"
            style={{
              textAling: "center",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ccc",
              marginTop: "5px",
              display: "flex",
              justifyContent: "center",
           
              
            }}
          >
            <IonInput
              style={{ borderRadius: "0", padding: "0px" }} // Estilo redondeado para el input
              placeholder="Ingresa tu email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonButton
              style={{ borderRadius: "20px 10px 10px 20px", padding: "5px 0px 5px 5px", color:"white" }} // Estilo redondeado para el botón
              onClick={handleSubscribe}
            >
              Suscribirme
            </IonButton>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default WelcomeCard;
