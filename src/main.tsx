import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MapCenter from './components/MapCenter.tsx';
import { MapProvider } from 'react-map-gl';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <MapCenter />
      </MapProvider>
    </QueryClientProvider>
  </StrictMode>
);
