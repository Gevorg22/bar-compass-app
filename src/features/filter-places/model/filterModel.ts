'use client';

import { useMemo } from 'react';

import { calculateBearing, calculateDistance } from '@/shared/lib/geo';
import { useAppStore } from '@/shared/store/appStore';
import type { Place, PlaceTypeFilter } from '@/entities/place/model/types';

export function useFilteredPlaces(): Place[] {
  const { places, activeFilters, showOnlyOpen, userLocation } = useAppStore();

  return useMemo(() => {
    return places
      .map((place) => {
        if (!userLocation) return place;
        const distanceKm = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          place.lat,
          place.lon,
        );
        const bearing = calculateBearing(userLocation.lat, userLocation.lon, place.lat, place.lon);
        return { ...place, distanceKm, bearing };
      })
      .filter((place) => {
        if (!activeFilters.includes(place.type)) return false;
        if (showOnlyOpen && place.isOpen === false) return false;
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [places, activeFilters, showOnlyOpen, userLocation]);
}

export function useFilterState() {
  const { activeFilters, showOnlyOpen, toggleFilter, toggleShowOnlyOpen } = useAppStore();

  const isFilterActive = (filter: PlaceTypeFilter) => activeFilters.includes(filter);

  return { activeFilters, showOnlyOpen, toggleFilter, toggleShowOnlyOpen, isFilterActive };
}
