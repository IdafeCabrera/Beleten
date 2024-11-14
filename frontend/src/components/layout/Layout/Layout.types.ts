// frontend/src/components/layout/Layout/Layout.types.ts
import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export interface ScrollState {
  isVisible: boolean;
  scrollTop: number;
}

export interface ScrollButtonsProps {
  visible: boolean;
  onScrollTop: () => void;
  onHomeClick: () => void;
}