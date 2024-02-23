import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bg-index/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          chakra: [
            '@chakra-ui/react',
            '@chakra-ui/icons',
            '@emotion/react',
            '@emotion/styled',
            'framer-motion'
          ],
          lodash: ['lodash'],
          atlas: ['realm-web']
        }
      }
    }
  }
})
