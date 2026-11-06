import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Псевдонім @/ береться з paths у tsconfig.app.json
  resolve: { tsconfigPaths: true },
});
