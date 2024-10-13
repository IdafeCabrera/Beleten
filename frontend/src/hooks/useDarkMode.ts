import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Comprueba si hay una preferencia guardada
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      // Si no hay preferencia guardada, usa la preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(prefersDark.matches);
    }
  }, []);

  useEffect(() => {
    // Aplica el modo oscuro
    document.body.classList.toggle('dark', darkMode);
    // Guarda la preferencia
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return { darkMode, setDarkMode };
};