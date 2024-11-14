export const SCROLL_CONFIG = {
  THRESHOLD: 100,
  SCROLL_DURATION: 300,
  ANIMATION_DURATION: '0.3s',
} as const;

export const BUTTON_CONFIG = {
  SIZE: 'small' as const,
  COLOR: 'primary' as const,
  GAP: '10px',
} as const;

export const CSS_CLASSES = {
  container: 'layout-container',
  content: 'layout-content',
  visible: 'is-visible',
  hidden: 'is-hidden',
} as const;

// También podemos agrupar todas las constantes en un objeto si prefieres
export const LAYOUT_CONSTANTS = {
  SCROLL: SCROLL_CONFIG,
  BUTTON: BUTTON_CONFIG,
  CSS: CSS_CLASSES,
} as const;