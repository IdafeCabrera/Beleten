// frontend/src/features/auth/components/ProtectedRoute.tsx
import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';

interface ProtectedRouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
  path: string;
  exact?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
