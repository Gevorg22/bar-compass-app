'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import type maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import { useAppStore } from '@/shared/store/appStore';
import { getPlaceTypeEmoji } from '@/entities/place/lib/formatters';
import { useFilteredPlaces } from '@/features/filter-places';

import styles from './MapView.module.css';

export function MapView() {
  const { userLocation, selectedPlace, setSelectedPlace } = useAppStore();
  const filteredPlaces = useFilteredPlaces();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const maplibre = await import('maplibre-gl');

      const center: [number, number] = userLocation
        ? [userLocation.lon, userLocation.lat]
        : [37.6176, 55.7558];

      const map = new maplibre.Map({
        container: mapRef.current as HTMLElement,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center,
        zoom: 15,
        attributionControl: false,
      });

      map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-right');

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [userLocation]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const addUserMarker = async () => {
      const maplibre = await import('maplibre-gl');

      const el = document.createElement('div');
      el.className = styles.userMarker;
      el.innerHTML = `<div class="${styles.userDot}"></div><div class="${styles.userPulse}"></div>`;

      new maplibre.Marker({ element: el })
        .setLngLat([userLocation.lon, userLocation.lat])
        .addTo(map);
    };

    addUserMarker();
  }, [userLocation]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const updateMarkers = async () => {
      const maplibre = await import('maplibre-gl');

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      filteredPlaces.forEach((place) => {
        const el = document.createElement('button');
        el.className = `${styles.placeMarker} ${selectedPlace?.id === place.id ? styles.placeMarkerActive : ''}`;
        el.textContent = getPlaceTypeEmoji(place.type);
        el.setAttribute('aria-label', place.name);
        el.addEventListener('click', () => setSelectedPlace(place));

        const marker = new maplibre.Marker({ element: el })
          .setLngLat([place.lon, place.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    updateMarkers();
  }, [filteredPlaces, selectedPlace, setSelectedPlace]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    map.flyTo({
      center: [selectedPlace.lon, selectedPlace.lat],
      zoom: 16,
      duration: 800,
      essential: true,
    });
  }, [selectedPlace]);

  return (
    <div className={styles.container}>
      <div ref={mapRef} className={styles.map} />
    </div>
  );
}
