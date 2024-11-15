// backend/src/config/environment.ts
interface Environment {
    apiUrl: string;
  }
  
  const getApiUrl = (): string => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
  
    // En desarrollo, si no hay variable de entorno, usar la URL relativa
    if (process.env.NODE_ENV === 'development') {
      return '/api';
    }
  
    // En producción, usar ruta relativa
    return '/api';
  };
  


  export const environment = {
    apiUrl: getApiUrl(),
    
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    database: {
      syncForce: false, // Nunca usar force en producción
      syncAlter: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }
  };