// frontend/src/config/config.ts
import { Capacitor } from '@capacitor/core';

const BACKEND_URL = 'http://192.168.86.29:8080';

export const config = {
  baseUrl: BACKEND_URL,
  apiUrl: `${BACKEND_URL}/api`,
  getImageUrl: (filename: string | null) => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return `${BACKEND_URL}${filename}`;
  }
};




