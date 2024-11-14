// frontend/src/components/Menu.tsx
import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { home, personCircle, notifications, settings } from 'ionicons/icons';

const menuItems = [
  { icon: home, text: 'Inicio', url: '/home' },
  { icon: personCircle, text: 'Perfil', url: '/profile' },
  { icon: notifications, text: 'Notificaciones', url: '/notifications' },
  { icon: settings, text: 'Configuración', url: '/settings' },
];

const Menu: React.FC = () => {
  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {menuItems.map((item, index) => (
            <IonItem key={index} routerLink={item.url}>
              <IonIcon icon={item.icon} slot="start" />
              <IonLabel>{item.text}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
