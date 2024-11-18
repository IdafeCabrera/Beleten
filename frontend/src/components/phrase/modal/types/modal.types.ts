// frontend/src/components/phrase/modal/types/modal.types.ts
import { Photo } from "@capacitor/camera";

export interface Phrase {
  id?: string;
  text: string;
  author: string;
  category: string;
  tags: {
    es: string[];
  };
  filename: string | null;
  default_background_image: string | null;
  is_editable: boolean;
}

export interface PhraseFormData {
  text: string;
  author: string;
  category: string;
  tags: {
    es: string[];
  };
  photo?: Photo;
}