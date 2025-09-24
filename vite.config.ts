import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Ignorar errores de TypeScript en archivos UI que no se usan
        if (id.includes('components/ui/') && !id.includes('button') && !id.includes('card') && !id.includes('input') && !id.includes('badge') && !id.includes('dialog')) {
          return false;
        }
        return false;
      }
    },
    // Mejorar la configuración para producción
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2015'
  },
  // Configuración para mejor manejo de errores en producción
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    __BUILD_VERSION__: JSON.stringify(Date.now())
  }
})


