// frontend/src/components/Header.tsx
import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
} from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { MenuItem } from '../types/MenuItem';
import { useDarkMode } from '../hooks/useDarkMode';


import Logo from './Logo';


interface HeaderProps {
  title: string;
  menuItems: MenuItem[];
  className?: string;
}

const Header: React.FC<HeaderProps> = React.memo(({ title, menuItems }) => {
  const { darkMode, setDarkMode } = useDarkMode();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <IonHeader>
      {/* <SVGComponent width="10%" height="10%" /> */}
      
    
      <IonToolbar color="primary">

        <IonButtons slot="start">
         <Logo /> 
          <IonMenuButton />
        </IonButtons>
        
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={toggleDarkMode}>
            <IonIcon
              slot="icon-only"
              icon={darkMode ? sunny : moon}
              color={darkMode ? "warning" : "medium"}
            />
          </IonButton>
          {menuItems.map((item, index) => (
            <IonButton key={index} routerLink={item.url} className="ion-hide-md-down">
              <IonIcon slot="icon-only" icon={item.icon} />
            </IonButton>
          ))}
        </IonButtons>
      </IonToolbar>
      
    </IonHeader>
  );
});

export default Header;