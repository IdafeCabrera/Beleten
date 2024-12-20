// frontend/src/types/sorting.ts

import { Phrase } from "../features/phrases/types/phrase.types";

// types/sorting.ts
export type SortField = 'id' | 'text' | 'author' | 'created_at' | 'category';
export type SortOrder = 'asc' | 'desc';
export type SearchType = 'text' | 'author' | 'tag' | 'category';

interface PhraseSearchControlsProps {
  phrases: Phrase[];
  onSearch: (text: string, type: SearchType) => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
  currentSort: {
    field: SortField;
    order: SortOrder;
  };
}