import { Place } from '../types/serper';
import { ViewState } from 'react-map-gl';
import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

const INITIAL_VIEWPORT: ViewState = {
  longitude: -118.26326182991187,
  latitude: 34.04162072763611,
  zoom: 13,
  bearing: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
  pitch: 0,
};

interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  places: Place[];
}

function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
}

// interface PersistOptions {
//   name: string;
//   version: number;
// }

interface MapStoreState {
  searchQuery: string;
  layers: Layer[];
  viewState: ViewState;
}

interface MapStoreActions {
  updateSearchQuery: (query: string) => void;
  saveLayer: (name: string, places: Place[]) => void;
  toggleLayer: (id: string) => void;
  removeLayer: (id: string) => void;
  updateViewState: (viewState: ViewState) => void;
}

export type MapStore = MapStoreState & MapStoreActions;

export const useMapStore = create<MapStore>((set, get) => ({
  searchQuery: '',
  updateSearchQuery: (query: string) => {
    set(() => ({ searchQuery: query }));
  },
  layers: [],
  saveLayer: (name: string, places: Place[]) => {
    console.log('in saveLayer', name, places);
    const validPlaces = places.filter((place) =>
      isValidCoordinate(place.latitude, place.longitude)
    );

    if (validPlaces.length === 0) {
      console.warn('No valid coordinates found in pins');
      return;
    }

    const id = Date.now().toString();

    const existingLayer = get().layers.find((layer) => layer.id === id);

    if (existingLayer) {
      console.warn('Layer already exists');
      return;
    }

    const newLayer: Layer = {
      id,
      name,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
      visible: true,
      places: validPlaces,
    };
    set((state) => ({ layers: [...state.layers, newLayer] }));
  },
  toggleLayer: (id: string) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  },
  removeLayer: (id: string) => {
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    }));
  },
  viewState: INITIAL_VIEWPORT,
  updateViewState: (newViewState: ViewState) => {
    set((state) => {
      if (JSON.stringify(state.viewState) === JSON.stringify(newViewState)) {
        return state; // No change, don't update.
      }
      return { ...state, viewState: newViewState };
    });
  },
}));
