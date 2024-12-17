// frontend/src/app/hooks/useSearch.ts
// frontend/src/hooks/useSearch.ts
import { useState } from 'react';
import { searchService } from '../../services/search.service';
import { ApiResponse, Phrase, SearchType } from '../../features/phrases/types/phrase.types';
import { SearchParams, } from '../../features/phrases/types/search.types';



export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<Phrase[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);

  const performSearch = async (query: string, type: SearchType) => {
    try {
      setIsSearching(true);
      const response = await searchService.searchPhrases({ query, type });
      setSearchResults(response.phrases);
      setPagination(response.pagination);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Error en la búsqueda');
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreResults = async () => {
    if (!pagination?.hasMore || isSearching) return;

    try {
      setIsSearching(true);
      const nextPage = (pagination.currentPage || 0) + 1;
      const response = await searchService.searchPhrases({
        query: searchResults[0]?.text || '',
        type: 'text',
        page: nextPage
      });
      setSearchResults(prev => [...prev, ...response.phrases]);
      setPagination(response.pagination);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Error cargando más resultados');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setPagination(null);
    setSearchError(null);
  };

  return {
    searchResults,
    isSearching,
    searchError,
    pagination,
    performSearch,
    loadMoreResults,
    clearSearch
  };
};