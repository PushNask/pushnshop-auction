import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ConfigEnv, UserConfig } from 'vite';
import { BuildMonitor } from './src/lib/monitoring/BuildMonitor';

const buildMonitor = BuildMonitor.getInstance();

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'build-monitor',
      buildStart() {
        buildMonitor.startBuild();
      },
      buildEnd(error) {
        if (error) {
          buildMonitor.logBuildError({
            type: 'compile',
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          });
        }
        buildMonitor.endBuild(!error);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo || !assetInfo.name) {
            return 'assets/[name].[hash][extname]';
          }

          const info = assetInfo.name;
          const ext = info.split('.').pop()?.toLowerCase() || '';

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name].[hash][extname]';
          }
          
          if (ext === 'css') {
            return 'assets/css/[name].[hash][extname]';
          }
          
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
}));