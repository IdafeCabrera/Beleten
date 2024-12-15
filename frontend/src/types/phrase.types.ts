// frontend/src/types/phrase.types.ts
// src/types/phrase.types.ts
import { Photo } from "@capacitor/camera";
import { CardDesign } from "./card.types";

export interface Translation {
  language: string;
  translated_text: string;
  submitted_by: string;
  last_edited_by: string | null;
  last_edited_at: string | null;
}


export interface ApiResponse {
  phrases: Phrase[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}
export interface Phrase {
  favorite: unknown;
  id: number;
  text: string;
  author: string;
  alias: string | null;
  category: string | null;
  date_of_birth: string | null;
  date_of_death: string | null;
  reflection: string | null;
  tags: { [key: string]: string[] };
  historical_context: string | null;
  career: string | null;
  author_image: string | null;
  default_background_image: string | null;
  custom_background_image: string | null;
  submitted_by: string;
  created_at: string;
  last_edited_by: string | null;
  last_edited_at: string | null;
  original_language: string;
  translations: Translation[];
  backgroundColor: string | null;
  fontColor: string | null;
  fontFamily: string | null;
  backgroundImage: string | null;
  is_verified: boolean;
  is_editable: boolean;
  filename: string | null;
  photo?: Photo;
}

export interface PhraseFormData extends Partial<Phrase> {
  photo?: Photo;
}

// Props para tarjetas
export interface PhraseCardBaseProps {
  phrase: Phrase;
  onEdit: (phrase: Phrase) => void;
  onDelete: (id: number) => Promise<void>;
}

export interface PhraseCardProps extends PhraseCardBaseProps {
  design: CardDesign;
}

export interface PhraseDesignProps extends PhraseCardBaseProps {
  className?: string;
}

// Tipos para la API y paginación
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

// También podemos incluir otros tipos relacionados con las frases aquí
export type SearchType = 'text' | 'author' | 'tag' | 'category';
export type SortField = 'id' | 'text' | 'author' | 'created_at' | 'category';
export type SortOrder = 'asc' | 'desc';