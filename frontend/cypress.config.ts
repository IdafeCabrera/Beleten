// frontend/cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://192.168.74.226:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});