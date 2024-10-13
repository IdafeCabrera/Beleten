import React from 'react';
import { IonPage } from '@ionic/react';
import ComponenteFrases from '../components/ComponenteFrases';
import Layout from '../components/Layout';

const Frases: React.FC = () => {
  return (
    <Layout>
    
      <ComponenteFrases />  {/* Utilizamos el componente para mostrar las frases */}
    
    </Layout>
  );
};

export default Frases;
