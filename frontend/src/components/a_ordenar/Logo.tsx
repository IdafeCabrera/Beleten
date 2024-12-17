// frontend/src/components/Logo.tsx
import React from 'react';
import './Logo.css';
import SVGComponent from './SVGComponent';
import { IonRouterLink } from '@ionic/react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`logo-container ${className}`}>
      <IonRouterLink routerLink="/home">
<SVGComponent />
</IonRouterLink>
    </div>
  );
};

export default Logo;