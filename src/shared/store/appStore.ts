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
  showOnlyOpen: boolean;
  isLoading: boolean;
  error: string | null;

  setUserLocation: (location: UserLocation) => void;
  setPlaces: (places: Place[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  setDeviceHeading: (heading: number) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleFilter: (filter: PlaceTypeFilter) => void;
  toggleShowOnlyOpen: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

function computeFiltered(
  places: Place[],
  activeFilters: PlaceTypeFilter[],
  showOnlyOpen: boolean,
): Place[] {
  return places.filter((p) => {
    if (!activeFilters.includes(p.type)) return false;
    if (showOnlyOpen && p.isOpen === false) return false;
    return true;
  });
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      userLocation: null,
      places: [],
      selectedPlace: null,
      deviceHeading: 0,
      viewMode: 'compass',
      activeFilters: ['bar', 'pub', 'nightclub', 'alcohol', 'wine', 'beer', 'convenience'],
      showOnlyOpen: false,
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
          const filtered = computeFiltered(state.places, newFilters, state.showOnlyOpen);
          const selectedId = state.selectedPlace?.id;
          const selectedStillVisible =
            selectedId !== undefined && filtered.some((p) => p.id === selectedId);

          return {
            activeFilters: newFilters,
            selectedPlace: selectedStillVisible ? state.selectedPlace : (filtered[0] ?? null),
          };
        }),

      toggleShowOnlyOpen: () =>
        set((state) => {
          const next = !state.showOnlyOpen;
          const filtered = computeFiltered(state.places, state.activeFilters, next);
          const selectedId = state.selectedPlace?.id;
          const selectedStillVisible =
            selectedId !== undefined && filtered.some((p) => p.id === selectedId);

          return {
            showOnlyOpen: next,
            selectedPlace: selectedStillVisible ? state.selectedPlace : (filtered[0] ?? null),
          };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    { name: 'BarCompass Store' },
  ),
);
