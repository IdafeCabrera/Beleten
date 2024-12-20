// frontend/src/features/phrases/types/search.types.ts
export interface SearchParams {
    query: string;
    type: 'text' | 'author' | 'tag' | 'category';
    page?: number;
    limit?: number;
  }