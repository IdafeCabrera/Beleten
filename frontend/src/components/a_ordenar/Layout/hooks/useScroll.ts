// frontend/src/components/layout/Layout/hooks/useScroll.ts
import { useState, useRef, useCallback } from 'react';
import { SCROLL_CONFIG } from '../Layout.constants';

export const useScroll = () => {
  const [showButtons, setShowButtons] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);

  const handleScroll = useCallback((event: CustomEvent<any>) => {
    const scrollTop = event.detail.scrollTop;
    setShowButtons(scrollTop > SCROLL_CONFIG.THRESHOLD);
  }, []);

  const scrollToTop = useCallback(() => {
    contentRef.current?.scrollToTop(SCROLL_CONFIG.SCROLL_DURATION);
  }, []);

  return {
    contentRef,
    showButtons,
    handleScroll,
    scrollToTop,
  };
};