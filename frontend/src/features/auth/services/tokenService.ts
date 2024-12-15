// frontend/src/features/auth/services/tokenService.ts
export const tokenService = {
    saveToken: (token: string) => {
      localStorage.setItem('authToken', token);
    },
  
    getToken: () => {
      return localStorage.getItem('authToken');
    },
  
    removeToken: () => {
      localStorage.removeItem('authToken');
    },
  
    isTokenValid: (token: string): boolean => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    },
  };
  