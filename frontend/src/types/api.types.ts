// frontend/src/types/api.types.ts
import { Phrase } from "../features/phrases/types/phrase.types";

export interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasMore: boolean;
  }
  
  export interface PhraseApiResponse {
    phrases: Phrase[];
    pagination: PaginationData;
  }