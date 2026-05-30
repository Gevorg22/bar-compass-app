import type { PLACE_TYPES } from '@/shared/config/constants';

export type PlaceTypeFilter = keyof typeof PLACE_TYPES;

export interface Place {
  id: number;
  name: string;
  type: PlaceTypeFilter;
  lat: number;
  lon: number;
  distanceKm: number;
  bearing: number;
  tags: Record<string, string>;
}
