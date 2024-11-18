// frontend/src/components/phrase/modal/hooks/useModalDrag.ts
import { RefObject, useState } from 'react';

const useModalDrag = (dragRef: RefObject<HTMLDivElement>) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const initDrag = (e: React.MouseEvent) => {
    const modal = dragRef.current?.closest('.ion-modal') as HTMLElement;
    if (!modal) return;

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
      modal.style.transform = `translate(${e.clientX - startX}px, ${e.clientY - startY}px)`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return {
    position,
    initDrag,
  };
};

export default useModalDrag;