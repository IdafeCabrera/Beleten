// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import UserDashboard from './features/users/components/UseDashboard';
import PhrasePage from './pages/PhrasePage';
import { IonApp, IonButton, IonContent, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import PhrasesPage from './pages/PhrasePage';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { AuthProvider } from './features/auth/components/AuthProvider';
defineCustomElements(window);
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */

import './theme/variables.css';
import './theme/global.css';



setupIonicReact();
defineCustomElements(window);

// Componente para mostrar cuando no se encuentra una ruta
const NotFound = () => (
  <IonContent>
    <h1>404 - Página no encontrada</h1>
    <IonButton routerLink="/home">Volver al inicio</IonButton>
  </IonContent>
);

const App: React.FC = () => (
  <AuthProvider>
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          {/* Rutas públicas */}
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/phrases" component={PhrasesPage} />
          <Route exact path="/phrase/:id" component={PhrasePage} />
          
          {/* Rutas protegidas */}
          <ProtectedRoute exact path="/dashboard" component={UserDashboard} />
          
          {/* Redirección por defecto */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          
          {/* Ruta de captura para manejar rutas inexistentes */}
          <Route component={NotFound} />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  </AuthProvider>
);

export default App;


