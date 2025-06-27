import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority']
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'react-vendor') return 'assets/react-[hash].js'
          if (chunkInfo.name === 'ui-vendor') return 'assets/ui-[hash].js'
          if (chunkInfo.name === 'animation-vendor') return 'assets/animation-[hash].js'
          if (chunkInfo.name === 'icons-vendor') return 'assets/icons-[hash].js'
          if (chunkInfo.name === 'utils') return 'assets/utils-[hash].js'
          return 'assets/[name]-[hash].js'
        }
      }
    },
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@radix-ui/react-scroll-area']
  }
})
