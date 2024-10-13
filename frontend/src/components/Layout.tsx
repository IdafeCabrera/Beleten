import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Header from './Header';
import Menu from './Menu';

interface LayoutProps {
  children: React.ReactNode;  // Este será el contenido específico de cada página
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Menu /> {/* El menú se renderiza aquí y estará disponible en todas las páginas */}
      <IonPage id="main-content">
        <Header title="" menuItems={[]} />  {/* El header se carga en todas las páginas */}
        <IonContent>
          {children}  {/* Aquí se cargará el contenido específico de cada página */}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Layout;
