import { useQuery } from '@tanstack/react-query';
import { ViewState } from 'react-map-gl';
import { SerperResponse } from '../types/serper';
import { useEffect } from 'react';
import { useMapStore } from '../stores/mapStore';

const searchPlaces = async (
  query: string,
  viewport: ViewState
): Promise<SerperResponse> => {
  const data = {
    q: query,
    ll: `@${viewport.latitude},${viewport.longitude},${viewport.zoom}z`,
  };

  const response = await fetch('https://google.serper.dev/maps', {
    method: 'POST',
    headers: {
      'X-API-KEY': import.meta.env.VITE_SERPER_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to search places');
  }

  return response.json();
};

export const useSearchPlaces = (query: string, viewport: ViewState) => {
  const { saveLayer } = useMapStore();
  const placesQuery = useQuery({
    queryKey: ['searchPlaces', query, viewport],
    queryFn: () => searchPlaces(query, viewport),
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (placesQuery.data && !placesQuery.isFetching) {
      console.log('saving layer', query, placesQuery.data.places);
      saveLayer(query, placesQuery.data.places);
    }

    if (placesQuery.isFetching) {
      console.log('fetching places', query);
    }
  }, [placesQuery.data, placesQuery.isFetching, saveLayer, query]);

  return placesQuery;
};
