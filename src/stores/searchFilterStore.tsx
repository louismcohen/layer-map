import { create } from 'zustand';
import { SearchFilterState, SearchFilter } from '../types/searchFilter';

// const incrementFilterMode = (mode: FilterMode): FilterMode => (mode + 1) % 3;
const initialSearchFilterState: SearchFilterState = {
  searchTerm: '',
  searchInputFocused: false,
};

export const useSearchFilterStore = create<SearchFilter>()((set) => ({
  ...initialSearchFilterState,
  updateSearchTerm: (searchTerm) =>
    set((state) => ({
      ...state,
      searchTerm,
    })),
  updateSearchInputFocused: (searchInputFocused) =>
    set((state) => ({ ...state, searchInputFocused })),
}));
