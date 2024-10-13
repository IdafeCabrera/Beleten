// /src/components/ItemList.tsx
import React, { useEffect, useState } from 'react';
import { getItems, toggleFavorite, searchItemsByTag } from '../services/api';

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
    const response = await getItems(collection);
    setItems(response.data);
  };

  const handleFavorite = async (id: number) => {
    await toggleFavorite(collection, id);
    loadItems();
  };

  const handleSearch = async () => {
    if (searchTag) {
      const response = await searchItemsByTag(collection, searchTag);
      setItems(response.data);
    } else {
      loadItems();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
        placeholder="Search by tag"
      />
      <button onClick={handleSearch}>Search</button>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.title}</span>
          <span>{item.favorite ? '★' : '☆'}</span>
          <button onClick={() => handleFavorite(item.id)}>Toggle Favorite</button>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
