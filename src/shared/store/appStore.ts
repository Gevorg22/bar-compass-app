import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Place, PlaceTypeFilter } from '@/entities/place/model/types';
import type { UserLocation } from '@/entities/user-location/model/types';

export type ViewMode = 'compass' | 'radar' | 'map';

interface AppState {
  userLocation: UserLocation | null;
  places: Place[];
  selectedPlace: Place | null;
  deviceHeading: number;
  viewMode: ViewMode;
  activeFilters: PlaceTypeFilter[];
  isLoading: boolean;
  error: string | null;

  setUserLocation: (location: UserLocation) => void;
  setPlaces: (places: Place[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  setDeviceHeading: (heading: number) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleFilter: (filter: PlaceTypeFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      userLocation: null,
      places: [],
      selectedPlace: null,
      deviceHeading: 0,
      viewMode: 'compass',
      activeFilters: ['bar', 'pub', 'nightclub', 'alcohol'],
      isLoading: true,
      error: null,

      setUserLocation: (location) => set({ userLocation: location }),

      setPlaces: (places) => set({ places }),

      setSelectedPlace: (place) => set({ selectedPlace: place }),

      setDeviceHeading: (heading) => set({ deviceHeading: heading }),

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleFilter: (filter) =>
        set((state) => {
          const isActive = state.activeFilters.includes(filter);
          const updated = isActive
            ? state.activeFilters.filter((f) => f !== filter)
            : [...state.activeFilters, filter];

          const newFilters = updated.length > 0 ? updated : state.activeFilters;

          const filteredPlaces = state.places.filter((p) => newFilters.includes(p.type));
          const selectedStillVisible =
            state.selectedPlace !== null && newFilters.includes(state.selectedPlace.type);
          const newSelected = selectedStillVisible
            ? state.selectedPlace
            : (filteredPlaces[0] ?? null);

          return { activeFilters: newFilters, selectedPlace: newSelected };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    { name: 'BarCompass Store' },
  ),
);
