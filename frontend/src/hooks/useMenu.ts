import { useState, useEffect } from 'react';
import { menuController } from '@ionic/core';

export const useMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMenuState = async () => {
      const open = await menuController.isOpen();
      setIsOpen(open);
    };

    checkMenuState();

    const openHandler = () => setIsOpen(true);
    const closeHandler = () => setIsOpen(false);

    document.addEventListener('ionMenuDidOpen', openHandler);
    document.addEventListener('ionMenuDidClose', closeHandler);

    return () => {
      document.removeEventListener('ionMenuDidOpen', openHandler);
      document.removeEventListener('ionMenuDidClose', closeHandler);
    };
  }, []);

  return isOpen;
};