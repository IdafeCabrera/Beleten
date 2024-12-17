// frontend/src/components/layout/Layout/Layout.tsx
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useScroll } from './hooks/useScroll';
import { ScrollButtons } from './components/ScrollButtons';
import { CSS_CLASSES } from './Layout.constants';
import type { LayoutProps } from './Layout.types';
import './Layout.css';

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const {
    contentRef,
    showButtons,
    handleScroll,
    scrollToTop,
  } = useScroll();

  const handleHomeClick = () => {
    window.location.href = '/home';
  };

  return (
    <IonPage className={CSS_CLASSES.container}>
      <IonContent
        ref={contentRef}
        scrollEvents={true}
        onIonScroll={handleScroll}
        className={`${CSS_CLASSES.content} ${className ?? ''}`}
      >
        {children}

        <ScrollButtons
          visible={showButtons}
          onScrollTop={scrollToTop}
          onHomeClick={handleHomeClick}
        />
      </IonContent>
    </IonPage>
  );
};

export default Layout;