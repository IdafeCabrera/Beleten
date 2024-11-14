// frontend/src/controllers/usePhraseController.tsx
import { useState, useEffect, useRef } from "react";
import { Phrase } from "../types/Phrase";
import { apiService } from "../services/api.service";

// Actualizar las interfaces
interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasMore: boolean;
}

// Interfaz del controlador
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
  totalPhrases: number;
}

// Actualizar la interfaz ApiResponse para incluir la paginación
interface ApiResponse {
  phrases: Phrase[];
  pagination: PaginationData;
}

export const usePhraseController = (): PhraseControllerReturn => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPhrases, setTotalPhrases] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const lastScrollPosition = useRef<number>(0);
  const loadingRef = useRef(false);

  const fetchPhrases = async (page: number): Promise<ApiResponse> => {
    try {
      console.log(`⬇️ Fetching page ${page} with limit ${ITEMS_PER_PAGE}`);
      
      const response = await apiService.get<any>("phrases", {
        page,
        limit: ITEMS_PER_PAGE
      });

      if (Array.isArray(response)) {
        const total = response.length;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedPhrases = response.slice(startIndex, endIndex);
        
        console.log(`📦 Page ${page}: Got ${paginatedPhrases.length} items (${startIndex}-${endIndex} of ${total})`);

        return {
          phrases: paginatedPhrases,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / ITEMS_PER_PAGE),
            totalItems: total,
            itemsPerPage: ITEMS_PER_PAGE,
            hasMore: endIndex < total
          }
        };
      }

      return response;
    } catch (err) {
      console.error("❌ Error fetching phrases:", err);
      throw new Error("Error al cargar las frases. " + err);
    }
  };


  
  const loadMorePhrases = async () => {
    // Usar una ref para evitar carreras de condiciones
    if (loadingRef.current || !hasMore) {
      console.log('⏭️ Skipping load:', { loading: loadingRef.current, hasMore });
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);
      lastScrollPosition.current = window.scrollY;
      const nextPage = currentPage + 1;

      console.log(`📥 Loading page ${nextPage} (${phrases.length}/${totalPhrases} loaded)`);
      const data = await fetchPhrases(nextPage);

      if (data.phrases && data.phrases.length > 0) {
        setPhrases(prevPhrases => {
          const existingIds = new Set(prevPhrases.map(p => p.id));
          const newPhrases = data.phrases.filter(p => !existingIds.has(p.id));
          const updatedPhrases = [...prevPhrases, ...newPhrases];
          
          console.log(`✨ Added ${newPhrases.length} new phrases. Total: ${updatedPhrases.length}/${totalPhrases}`);
          
          // Actualizar hasMore basado en el total real
          const remainingItems = totalPhrases - updatedPhrases.length;
          console.log(`📊 Remaining items: ${remainingItems}`);
          setHasMore(remainingItems > 0);
          
          return updatedPhrases;
        });

        setCurrentPage(nextPage);

        // Restaurar posición del scroll
        if (lastScrollPosition.current) {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: lastScrollPosition.current,
              behavior: 'instant'
            });
          });
        }
      } else {
        console.log('🏁 No more phrases available');
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Error loading more phrases:", err);
      setError("Error al cargar más frases: " + err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  };


  useEffect(() => {
    const loadInitialPhrases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPhrases(1);
        setPhrases(data.phrases);
        setTotalPhrases(data.pagination.totalItems);
        setHasMore(data.pagination.hasMore);
        setCurrentPage(1);
        
        console.log(`🚀 Initial load complete: ${data.phrases.length}/${data.pagination.totalItems}`);
      } catch (err) {
        setError("Error al cargar las frases. " + err);
        console.error("❌ Error loading initial phrases:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPhrases();
  }, []);



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

      // Recargar la primera página después de guardar
      const data = await fetchPhrases(1);
      setPhrases(data.phrases);
      setTotalPhrases(data.pagination.totalItems);
      setCurrentPage(1);
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
      setPhrases(prevPhrases => prevPhrases.filter(p => p.id !== id));
      setTotalPhrases(prev => prev - 1);
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
    totalPhrases
  };
};