// frontend/src/types/Phrase.ts
export interface Translation {
  language: string;
  translated_text: string;
  submitted_by: string;
  last_edited_by?: string;
  last_edited_at?: Date | null;
}

export interface Phrase {
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
  translations: Array<{
    language: string;
    translated_text: string;
    submitted_by: string;
    last_edited_by: string | null;
    last_edited_at: string | null;
  }>;
  backgroundColor: string | null;
  fontColor: string | null;
  fontFamily: string | null;
  backgroundImage: string | null;

  is_verified: boolean;
  is_editable: boolean;
}
