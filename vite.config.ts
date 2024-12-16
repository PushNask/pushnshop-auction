import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ConfigEnv, UserConfig, Plugin, PluginOption } from 'vite';
import { BuildMonitor } from './src/lib/monitoring/BuildMonitor';

const buildMonitor = BuildMonitor.getInstance();

const buildMonitorPlugin: Plugin = {
  name: 'build-monitor',
  buildStart() {
    buildMonitor.startBuild();
    console.log('Build started with environment variables:', {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'set' : 'not set',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'not set',
    });
  },
  buildEnd(error?: Error) {
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
};

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    buildMonitorPlugin
  ].filter(Boolean as unknown as (<T>(x: T | false) => x is T)),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
          supabase: ['@supabase/supabase-js']
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
    assetsInlineLimit: 4096,
  },
  define: {
    __VITE_SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
    __VITE_SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || '')
  }
}));