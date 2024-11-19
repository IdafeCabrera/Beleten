// frontend/src/services/auth.service.ts
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { apiService } from './api.service';
import { toastService } from './toast.service';

export interface User {
  id?: number;
  username: string;
  email?: string;
  password?: string;
  role: 'admin' | 'editor' | 'user';
  token?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Añadimos esta interfaz para los permisos
interface PhrasePermissionResponse {
  canEdit: boolean;
  canDelete?: boolean;
  isOwner?: boolean;
}

class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    this.init();
  }

  private async init() {
    const { value } = await Preferences.get({ key: 'currentUser' });
    if (value) {
      try {
        const user = JSON.parse(value);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }
  async register(registerData: RegisterData): Promise<boolean> {
    try {
      const response = await apiService.post<LoginResponse>('auth/register', registerData);
      
      if (response && response.user && response.token) {
        const user = {
          ...response.user,
          token: response.token
        };
        
        await Preferences.set({
          key: 'currentUser',
          value: JSON.stringify(user)
        });
        
        this.currentUserSubject.next(user);
        toastService.success('Registro exitoso');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en registro:', error);
      if (error instanceof Error) {
        toastService.error(`Error en registro: ${error.message}`);
      } else {
        toastService.error('Error desconocido en el registro');
      }
      return false;
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const credentials = btoa(`${username}:${password}`);
      const authHeaders = {
        'Authorization': `Basic ${credentials}`
      };

      const response = await apiService.post<LoginResponse>(
        'auth/login', 
        null, 
        authHeaders
      );
      
      if (response && response.user && response.token) {
        const user = {
          ...response.user,
          token: response.token
        };
        
        await Preferences.set({
          key: 'currentUser',
          value: JSON.stringify(user)
        });
        
        this.currentUserSubject.next(user);
        toastService.success('Login exitoso');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      toastService.error('Error en el login');
      return false;
    }
  }

  async canEditPhrase(phraseId: number): Promise<boolean> {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    try {
      const authHeaders = {
        'Authorization': `Bearer ${user.token}`
      };
      
      const response = await apiService.get<PhrasePermissionResponse>(
        `phrases/${phraseId}/permissions`,
        {},
        authHeaders
      );
      
      return response?.canEdit || false;
    } catch {
      return false;
    }
  }

  async canDeletePhrase(phraseId: number): Promise<boolean> {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    try {
      const authHeaders = {
        'Authorization': `Bearer ${user.token}`
      };
      
      const response = await apiService.get<PhrasePermissionResponse>(
        `phrases/${phraseId}/permissions`,
        {},
        authHeaders
      );
      
      return response?.canDelete || user.role === 'admin' || false;
    } catch {
      return false;
    }
  }

  async logout() {
    await Preferences.remove({ key: 'currentUser' });
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  async getAuthToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'currentUser' });
    if (value) {
      const user = JSON.parse(value);
      return user?.token || null;
    }
    return null;
  }
}

export const authService = new AuthService();