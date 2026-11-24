import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname.replace(/^\/(\w:)/, "$1") } },
  server: {
    proxy: {
      // Keeps browser requests same-origin and avoids local CORS configuration.
      '/petclinic-api': {
        target: 'http://localhost:9966',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/petclinic-api/, '/petclinic/api'),
      },
    },
  },
});
