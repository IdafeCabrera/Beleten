// frontend/src/features/users/services/userService.ts
import { UserDetails, Favorite, EditRequest } from '../types/UserTypes'; 

export const fetchUserDetails = async (): Promise<UserDetails> => {
    const response = await fetch('/api/user/details');
    return response.json();
  };
  
  
  export const fetchUserFavorites = async (): Promise<Favorite[]> => {
    const response = await fetch('/api/user/favorites');
    return response.json();
  };
  
  export const fetchEditRequests = async (): Promise<EditRequest[]> => {
    const response = await fetch('/api/user/edit-requests');
    return response.json();
  };