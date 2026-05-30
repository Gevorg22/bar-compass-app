'use client';

import { useCallback, useEffect, useRef } from 'react';

import { calculateDistance } from '@/shared/lib/geo';
import { useAppStore } from '@/shared/store/appStore';

import { loadNearbyPlaces } from '../api/overpassQuery';

const REFETCH_DISTANCE_THRESHOLD_KM = 0.1;

export function useFindPlaces() {
  const { userLocation, setPlaces, setSelectedPlace, setLoading, setError } = useAppStore();
  const lastFetchLocationRef = useRef<{ lat: number; lon: number } | null>(null);
  const isFetchingRef = useRef(false);

  const fetchPlaces = useCallback(
    async (lat: number, lon: number) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const places = await loadNearbyPlaces(lat, lon);
        setPlaces(places);

        if (places.length > 0) {
          setSelectedPlace(places[0]);
        }

        lastFetchLocationRef.current = { lat, lon };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка загрузки мест';
        setError(message);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [setPlaces, setSelectedPlace, setLoading, setError],
  );

  useEffect(() => {
    if (!userLocation) return;

    const { lat, lon } = userLocation;
    const lastFetch = lastFetchLocationRef.current;

    if (lastFetch) {
      const dist = calculateDistance(lastFetch.lat, lastFetch.lon, lat, lon);
      if (dist < REFETCH_DISTANCE_THRESHOLD_KM) return;
    }

    fetchPlaces(lat, lon);
  }, [userLocation, fetchPlaces]);

  return { refetch: fetchPlaces };
}
