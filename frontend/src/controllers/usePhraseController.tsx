// frontend/src/controllers/usePhraseController.tsx
import { useState, useEffect, useRef } from "react";
import { Phrase } from "../features/phrases/types/phrase.types";
import { apiService } from "../services/api.service";
import { toastService } from "../services/toast.service";
import { Capacitor } from '@capacitor/core';
import { Photo } from '@capacitor/camera';
import { photoService } from '../services/photo.service';
import { useSearch } from '../app/hooks/useSearch';
import { SearchParams } from "../features/phrases/types/search.types";

import { searchService } from '../services/search.service';
import { phraseService } from '../services/phrase.service';


// Tipo para el filtro de búsqueda
interface SearchFilter {
  text: string;
  type: 'text' | 'author' | 'tag' | 'category';
}

// Tipo para las propiedades comparables de una frase
type ComparableFields = 'text' | 'author' | 'category' | 'tags' | 'reflection' | 'historical_context';

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
  performSearch: (text: string, type: 'text' | 'author' | 'tag' | 'category') => Promise<void>;
  clearSearch: () => void;
  isSearchActive: boolean;
  scrollPosition: number;
}

// Actualizar la interfaz ApiResponse para incluir la paginación
interface ApiResponse {
  phrases: Phrase[];
  pagination: PaginationData;
}

export const usePhraseController = (): PhraseControllerReturn => {

  const {
    searchResults,
    isSearching,
    searchError,
    pagination: searchPagination,
    performSearch,
    loadMoreResults,
    
  } = useSearch();


  const clearSearch = () => {
    setSearchFilter({ text: '', type: 'text' });
    setFilteredPhrases(phrases);
  }; 


  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const [isLoading, setIsLoading] = useState(false);




  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>([]);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({ text: '', type: 'text' });
  //const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPhrases, setTotalPhrases] = useState(0);
  const ITEMS_PER_PAGE = 25;

  // Estado para la posición del scroll
  const scrollPositionRef = useRef<number>(0);
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(false);

  const loadPhrases = async (page = 1, resetResults = false) => {
    try {
      setIsLoading(true);
      let response;

      if (searchParams) {
        response = await searchService.searchPhrases({
          ...searchParams,
          page,
          limit: 25
        });
      } else {
        response = await phraseService.getPhrases(page);
      }

      setPhrases(prev => resetResults ? response.phrases : [...prev, ...response.phrases]);
      return response;
    } finally {
      setIsLoading(false);
    }
  };
  const loadingRef = useRef(false);


 // Función para filtrar frases
 const filterPhrases = (searchText: string, searchType: 'text' | 'author' | 'tag' | 'category') => {
  if (!searchText.trim()) {
    setFilteredPhrases(phrases);
    return;
  }

  const normalizedSearch = searchText.toLowerCase().trim();
  
  const filtered = phrases.filter(phrase => {
    switch (searchType) {
      case 'text':
        return phrase.text?.toLowerCase().includes(normalizedSearch);
      case 'author':
        return phrase.author?.toLowerCase().includes(normalizedSearch);
      case 'category':
        return phrase.category?.toLowerCase().includes(normalizedSearch);
      case 'tag':
        return phrase.tags?.es?.some(tag => 
          tag.toLowerCase().includes(normalizedSearch)
        );
      default:
        return false;
    }
  });

  setFilteredPhrases(filtered);
};



    // Efecto para aplicar filtros cuando cambian
    useEffect(() => {
      filterPhrases(searchFilter.text, searchFilter.type);
    }, [searchFilter, phrases]);
  
    // Función para manejar la búsqueda
    const handleSearch = (text: string, type: 'text' | 'author' | 'tag' | 'category') => {
      setSearchFilter({ text, type });
    };
  
    // Función para limpiar la búsqueda


  const fetchPhrases = async (page: number): Promise<ApiResponse> => {
    try {
      console.log('Diagnostic Info:', {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        page,
        itemsPerPage: ITEMS_PER_PAGE
      });

      console.log(`⬇️ Fetching page ${page} with limit ${ITEMS_PER_PAGE}`);
      
      const response = await apiService.get<any>("phrases", {
        page,
        limit: ITEMS_PER_PAGE
      });

      console.log('API Response:', response);

      if (Array.isArray(response)) {
        const total = response.length;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedPhrases = response.slice(startIndex, endIndex);
        
        console.log(`📦 Page ${page}: Got ${paginatedPhrases.length} items (${startIndex}-${endIndex} of ${total})`);

        console.log('Pagination Info:', {
          total,
          startIndex,
          endIndex,
          resultCount: paginatedPhrases.length
        });

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
      console.error("❌ Error fetching phrases:", {
        error: err,
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        endpoint: 'phrases',
        params: { page, limit: ITEMS_PER_PAGE }
      });
      throw new Error("Error al cargar las frases. " + err);
    }
  };


  
  const loadMorePhrases = async () => {
    // Verifica si ya está en carga o si no hay más frases para cargar
    if (loadingRef.current || !hasMore) {
      console.log('⏭️ Skipping load:', { loading: loadingRef.current, hasMore });
      return;
    }
  
    try {
      // aqui estaba el error porque no seguía cargando las frases, era porque estaban inicializadas en true
      loadingRef.current = true;
      setIsLoading(false); // Marca como cargando
  
      const nextPage = currentPage + 1;
      console.log(`📥 Loading page ${nextPage} (${phrases.length}/${totalPhrases} loaded)`);
  
      // Llamada a la API para cargar la siguiente página
      const data = await fetchPhrases(nextPage);
  
      if (data.phrases.length > 0) {
        setPhrases(prevPhrases => {
          const existingIds = new Set(prevPhrases.map(p => p.id));
          const newPhrases = data.phrases.filter(p => !existingIds.has(p.id));
          return [...prevPhrases, ...newPhrases];
        });
  
        setCurrentPage(nextPage);
        setTotalPhrases(data.pagination.totalItems);
  
        // Actualiza el estado de 'hasMore' en función de si hay más datos
        if (data.pagination.hasMore) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
  
        console.log(`✅ Load more completed. Total phrases: ${phrases.length}/${totalPhrases}`);
      } else {
        console.log('🏁 No more phrases available');
        setHasMore(false); // Marca como que no hay más frases para cargar
      }
    } catch (err) {
      console.error("❌ Error loading more phrases:", err);
      setError("Error al cargar más frases: " + err);
    } finally {
      setIsLoading(false); // Desmarca como cargando
      loadingRef.current = false; // Restablece la bandera
    }
  };
  


  useEffect(() => {
    const loadInitialPhrases = async () => {
      try {
        console.log('🚀 Starting initial load...', {
          platform: Capacitor.getPlatform(),
          isNative: Capacitor.isNativePlatform()
        });

        setIsLoading(true);
        setError(null);

        const data = await fetchPhrases(1);
        setPhrases(data.phrases);
        setFilteredPhrases(data.phrases);
        setTotalPhrases(data.pagination.totalItems);
        setHasMore(data.pagination.hasMore);
        setCurrentPage(1);

        console.log('🚀 Initial load complete:', {
          phrasesCount: data.phrases.length,
          totalItems: data.pagination.totalItems,
          hasMore: data.pagination.hasMore
        });


      } catch (err) {
        console.error("❌ Error loading initial phrases:", {
          error: err,
          platform: Capacitor.getPlatform(),
          isNative: Capacitor.isNativePlatform()
        });
        setError("Error al cargar las frases. " + err);
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
  // @@@@@@CORREGIR arreglar que cuando scroll abajo del todo subes y creas una nueva frase, luego ya no carga mas porque se cree que ya esta todo scroleado
  const savePhrase = async (phraseData: Partial<Phrase> & { photo?: Photo }) => {
    try {
      // Guardar la posición actual del scroll antes de la actualización
      scrollPositionRef.current = window.scrollY;
      setShouldRestoreScroll(true);

      setError(null);
      
      // Extraer la foto del objeto de datos
      const { photo, ...phraseDetails } = phraseData;
      let savedPhrase: Phrase;

      // Validación del texto
      if (!phraseDetails.text?.trim()) {
        toastService.error('El texto de la frase es obligatorio');
        return;
      }

      // Si es una actualización
      if (currentPhrase?.id) {
        // Verificar si la frase es editable
        if (!currentPhrase.is_editable) {
          toastService.warning('Esta frase no es editable');
          closeModal();
          return;
        }
      // Lista de campos a comparar
      const comparableFields: ComparableFields[] = [
        'text',
        'author',
        'category',
        'tags',
        'reflection',
        'historical_context'
      ];
     // Comparar cambios solo en campos relevantes
     const hasChanges = comparableFields.some(field => {
      const newValue = phraseDetails[field];
      const currentValue = currentPhrase[field];

             // Si el campo es tags, hacer una comparación especial
             if (field === 'tags') {
              return JSON.stringify(newValue) !== JSON.stringify(currentValue);
            }

            return newValue !== undefined && newValue !== currentValue;
          });

          



        if (!hasChanges && !photo) {
          toastService.info('No se han detectado cambios en la frase');
          closeModal();
          return;
        }

        // Actualizar frase
        console.log('📝 Actualizando frase existente:', currentPhrase.id);
        savedPhrase = await apiService.put(`phrases/${currentPhrase.id}`, phraseDetails);
        console.log('✅ Frase actualizada:', savedPhrase);
      } else {
        // Crear nueva frase
        console.log('✨ Creando nueva frase');
        try {
          savedPhrase = await apiService.post("phrases", phraseDetails);
          console.log('✅ Frase creada:', savedPhrase);
        } catch (err: any) {
          if (err.status === 409) {
            toastService.error('Ya existe una frase con este texto');
            return;
          }
          throw err;
        }
      }




      // Manejo de la imagen
      if (photo && savedPhrase.id) {
        console.log('📤 Subiendo imagen para la frase:', savedPhrase.id);
        try {
          const imageUrl = await photoService.uploadImage(savedPhrase.id, photo);
          console.log('✅ Imagen subida correctamente:', imageUrl);

          // Actualizar la frase con la URL de la imagen
          savedPhrase = await apiService.put(`phrases/${savedPhrase.id}`, {
            ...savedPhrase,
            filename: imageUrl
          });
        } catch (imageError) {
          console.error('❌ Error al subir la imagen:', imageError);
          toastService.warning('La frase se guardó pero hubo un error al subir la imagen');
        }
      }

      // Recargar frases y mostrar mensaje de éxito
      const data = await fetchPhrases(1);
      setPhrases(data.phrases);
      setTotalPhrases(data.pagination.totalItems);
      setCurrentPage(1);
      

            // Recargar frases manteniendo la página actual
            const currentPageToLoad = currentPage;
            const allPhrases: Phrase[] = [];
            
            // Cargar todas las páginas hasta la actual
            for (let page = 1; page <= currentPageToLoad; page++) {
              const data = await fetchPhrases(page);
              allPhrases.push(...data.phrases);
            }
      
            setPhrases(allPhrases);
            setTotalPhrases(data.pagination.totalItems);



      toastService.success(
        currentPhrase?.id 
          ? 'Frase actualizada correctamente'
          : 'Frase creada correctamente'
      );
      
      closeModal();

    } catch (err: any) {
      console.error("❌ Error al guardar la frase:", err);
      
      // Manejo específico de errores
      if (err.status === 413) {
        toastService.error('La imagen es demasiado grande');
      } else if (err.status === 422) {
        toastService.error('Datos de la frase inválidos');
      } else {
        toastService.error('Error al guardar la frase: ' + (err.message || 'Error desconocido'));
      }
      
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

   // Efecto para restaurar la posición del scroll
  useEffect(() => {
    if (shouldRestoreScroll && phrases.length > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'auto'
        });
        setShouldRestoreScroll(false);
      }, 100);
    }
  }, [shouldRestoreScroll, phrases]);

  return {
    // phrases: searchFilter.text ? filteredPhrases : phrases,
    phrases: searchResults.length > 0 ? searchResults : phrases,
    //isLoading,
    isLoading: isLoading || isSearching,
    //error,
    error: error || searchError,
    isModalOpen,
    currentPhrase,
    openEditModal,
    scrollPosition: scrollPositionRef.current,
    closeModal,
    savePhrase,
    deletePhrase,


    loadMorePhrases: searchResults.length > 0 ? loadMoreResults : loadMorePhrases,
    hasMore: searchResults.length > 0 ? (searchPagination?.hasMore || false) : hasMore,
    totalPhrases: searchResults.length > 0 ? (searchPagination?.totalItems || 0) : totalPhrases,
    performSearch,
    clearSearch,
    isSearchActive: searchResults.length > 0
    
    
  };
};