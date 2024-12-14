export const buildConfigs = {
  development: {
    environment: 'development' as const,
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_API_URL',
      'VITE_STORAGE_URL'
    ],
    requiredDependencies: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss'
    ],
    outputDir: './dist',
    staticAssets: [
      'assets/images/',
      'assets/fonts/',
      'assets/locales/'
    ]
  },
  staging: {
    environment: 'staging' as const,
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_API_URL',
      'VITE_STORAGE_URL'
    ],
    requiredDependencies: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss'
    ],
    outputDir: './dist',
    staticAssets: [
      'assets/images/',
      'assets/fonts/',
      'assets/locales/'
    ]
  },
  production: {
    environment: 'production' as const,
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_API_URL',
      'VITE_STORAGE_URL'
    ],
    requiredDependencies: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss'
    ],
    outputDir: './dist',
    staticAssets: [
      'assets/images/',
      'assets/fonts/',
      'assets/locales/'
    ]
  }
};