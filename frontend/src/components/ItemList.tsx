// frontend/src/components/ItemList.tsx
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';

interface Item {
  id: number;
  title: string;
  tags: string[];
  favorite: boolean;
}

const ItemList: React.FC<{ collection: string }> = ({ collection }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTag, setSearchTag] = useState<string>('');

  useEffect(() => {
    loadItems();
  }, [collection]);

  const loadItems = async () => {
    try {
      const response = await apiService.get<Item[]>(`${collection}`);
      setItems(response);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleFavorite = async (id: number) => {
    try {
      await apiService.put(`${collection}/${id}/favorite`, {});
      loadItems();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchTag) {
        const response = await apiService.get<Item[]>(`${collection}`, { tag: searchTag });
        setItems(response);
      } else {
        loadItems();
      }
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
        placeholder="Buscar por etiqueta"
      />
      <button onClick={handleSearch}>Buscar</button>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.title}</span>
          <span>{item.favorite ? '★' : '☆'}</span>
          <button onClick={() => handleFavorite(item.id)}>
            Toggle Favorite
          </button>
        </div>
      ))}
    </div>
  );
};

export default ItemList;