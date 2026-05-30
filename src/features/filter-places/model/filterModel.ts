import { useAppStore } from '@/shared/store/appStore';
import type { Place, PlaceTypeFilter } from '@/entities/place/model/types';

export function useFilteredPlaces(): Place[] {
  const { places, activeFilters } = useAppStore();
  return places.filter((place) => activeFilters.includes(place.type));
}

export function useFilterState() {
  const { activeFilters, toggleFilter } = useAppStore();

  const isFilterActive = (filter: PlaceTypeFilter) => activeFilters.includes(filter);

  return { activeFilters, toggleFilter, isFilterActive };
}
