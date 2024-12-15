// frontend/src/features/users/types/UserTypes.ts
export interface UserDetails {
    id: number;
    username: string;
    email: string;
    avatar: string;
    description: string;
  }
  
  export interface Favorite {
    id: number;
    text: string;
    author: string;
  }
  
  export interface EditRequest {
    id: number;
    phrase: string;
    status: string; // "pending", "approved", "rejected"
  }

  