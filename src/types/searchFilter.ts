export enum FilterMode {
  Disabled = 0,
  True,
  False,
}

export enum FilterColor {
  Green = 'green',
  Red = 'red',
  Purple = 'purple',
  Blue = 'blue',
}

export enum FilterType {
  Open = 'open',
  Visited = 'visited',
  Claimed = 'claimed',
}

export interface Filter {
  type: FilterType;
  mode: FilterMode;
  color: FilterColor;
  trueIcon: React.ReactNode;
  falseIcon: React.ReactNode;
}

export type FilterState = Record<FilterType, Filter>;
export interface SearchFilterState {
  searchTerm: string;
  searchInputFocused: boolean;
}
export interface SearchFilterActions {
  updateSearchTerm: (searchTerm: string) => void;
  updateSearchInputFocused: (focused: boolean) => void;
}

export type SearchFilter = SearchFilterState & SearchFilterActions;
