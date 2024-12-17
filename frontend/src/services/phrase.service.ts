// frontend/src/services/phrase.service.ts
import { apiService } from './api.service';
import { ApiResponse, Phrase } from '../features/phrases/types/phrase.types';

class PhraseService {
  async getPhrases(page = 1, limit = 25): Promise<ApiResponse> {
    return await apiService.get<ApiResponse>('phrases', {
      params: { page, limit }
    });
  }

  async createPhrase(data: Partial<Phrase>): Promise<Phrase> {
    return await apiService.post<Phrase>('phrases', data);
  }

  async updatePhrase(id: number, data: Partial<Phrase>): Promise<Phrase> {
    return await apiService.put<Phrase>(`phrases/${id}`, data);
  }

  async deletePhrase(id: number): Promise<void> {
    await apiService.delete(`phrases/${id}`);
  }
}

export const phraseService = new PhraseService();