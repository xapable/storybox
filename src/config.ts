// App configuration

const config = {
  appName: 'Play Store',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  defaultTab: 'home' as const,
};

export default config;
