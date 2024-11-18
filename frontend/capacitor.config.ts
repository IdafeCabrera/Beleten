// frontend/capacitor.config.ts
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Frontend',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    hostname: 'localhost',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
