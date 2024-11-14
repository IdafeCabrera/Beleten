// frontend/src/controllers/usePhraseController.tsx
import { useState, useEffect, useRef } from "react";
import { Phrase } from "../types/Phrase";
import { apiService } from "../services/api.service";


interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasMore: boolean;
}

// Interface que define lo que devuelve el controlador QUITAR
interface PhraseControllerReturn {
  phrases: Phrase[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  currentPhrase: Phrase | null;
  openEditModal: (phrase?: Phrase | null) => void;
  closeModal: () => void;
  savePhrase: (phrase: Partial<Phrase>) => Promise<void>;
  deletePhrase: (id: number) => Promise<void>;
  loadMorePhrases: () => Promise<void>;
  hasMore: boolean;
}

interface ApiResponse {
  phrases: Phrase[];
  total: number;
}

export const usePhraseController = (): PhraseControllerReturn => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Crear un ref para el contenedor
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchPhrases = async (page: number): Promise<ApiResponse> => {
    try {
      const data = await apiService.get<ApiResponse>("phrases", {
        page,
        limit: ITEMS_PER_PAGE,
      });
      if (Array.isArray(data)) {
        return {
          phrases: data,
          total: data.length + (page - 1) * ITEMS_PER_PAGE,
        };
      }

      return data;
    } catch (err) {
      console.error("Error fetching phrases:", err);
      throw new Error("Error al cargar las frases. " + err);
    }
  };

  useEffect(() => {
    const loadInitialPhrases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPhrases(1);
        setPhrases(data.phrases);
        setHasMore(data.phrases.length >= ITEMS_PER_PAGE);
        setCurrentPage(1);
      } catch (err) {
        setError("Error al cargar las frases. " + err);
        console.error("Error loading initial phrases:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPhrases();
  }, []);

  // Referencia para almacenar la posición del scroll
  const lastScrollPosition = useRef<number>(0);

  const loadMorePhrases = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      // Guardar la posición actual del scroll antes de cargar más frases
      lastScrollPosition.current = window.scrollY;
      const nextPage = currentPage + 1;

      const data = await fetchPhrases(nextPage);

      if (data.phrases.length > 0) {
        // Usar un callback en setPhrases para garantizar el estado más reciente
        setPhrases((prevPhrases) => [...prevPhrases, ...data.phrases]);
        setCurrentPage(nextPage);
        setHasMore(data.phrases.length >= ITEMS_PER_PAGE);

        // Restaurar la posición del scroll después de que el DOM se actualice
        requestAnimationFrame(() => {
          window.scrollTo({
            top: lastScrollPosition.current,
            behavior: 'instant'
          });
        });





      } else {
        setHasMore(false);
      }

    } catch (err) {
      console.error("Error loading more phrases:", err);
      setError("Error al cargar más frases. " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (phrase?: Phrase | null) => {
    setCurrentPhrase(phrase || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPhrase(null);
  };

  const savePhrase = async (phrase: Partial<Phrase>) => {
    try {
      setError(null);
      if (phrase.id) {
        await apiService.put(`phrases/${phrase.id}`, phrase);
      } else {
        await apiService.post("phrases", phrase);
      }

      const data = await fetchPhrases(1);
      setPhrases(data.phrases);
      closeModal();
    } catch (err) {
      console.error("Error saving phrase:", err);
      setError("Error al guardar la frase");
      throw err;
    }
  };

  const deletePhrase = async (id: number) => {
    try {
      setError(null);
      await apiService.delete(`phrases/${id}`);
      setPhrases((prevPhrases) => prevPhrases.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting phrase:", err);
      setError("Error al eliminar la frase");
      throw err;
    }
  };

  return {
    phrases,
    isLoading,
    error,
    isModalOpen,
    currentPhrase,
    openEditModal,
    closeModal,
    savePhrase,
    deletePhrase,
    loadMorePhrases,
    hasMore,
  };
};
