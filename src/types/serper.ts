export interface SerperResponse {
  searchParameters: SearchParameters;
  ll: string;
  places: Place[];
  credits: number;
}

export interface SearchParameters {
  q: string;
  type: string;
  ll: string;
  engine: string;
}

export interface Place {
  position: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  priceLevel: string;
  type: string;
  types: string[];
  website: string;
  phoneNumber: string;
  description: string;
  openingHours: OpeningHours;
  thumbnailUrl: string;
  cid: string;
  fid: string;
  placeId: string;
}

export interface OpeningHours {
  Saturday: string;
  Sunday: string;
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
}
