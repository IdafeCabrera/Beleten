// frontend/src/interfaces/auth.interface.ts
export interface User {
  id?: number;
  username: string;
  password?: string;
  role: 'admin' | 'editor' | 'user';
  token?: string;
  }
  export interface LoginResponse {
  user: User;
  token: string;
  }
  export interface PhrasePermissionResponse {
  canEdit: boolean;
  canDelete?: boolean;
  isOwner?: boolean;
  }
  export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  }