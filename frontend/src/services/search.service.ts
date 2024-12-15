// frontend/src/services/search.service.ts
import { apiService } from './api.service';
import { ApiResponse } from '../types/phrase.types';
import { SearchParams } from '../types/search.types';

class SearchService {
  async searchPhrases(params: SearchParams): Promise<ApiResponse> {
    const queryParams = new URLSearchParams({
      q: params.query.trim(),
      type: params.type,
      page: String(params.page || 1),
      limit: String(params.limit || 25)
    });
    
    try {
      const response = await apiService.get<ApiResponse>(`phrases/search?${queryParams}`);
      return response.phrases.length ? response : { 
        phrases: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasMore: false
        }
      };
    } catch (error) {
      return {
        phrases: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasMore: false
        }
      };
    }
  }
}

export const searchService = new SearchService();