import { OVERPASS_API_URL, OVERPASS_CACHE_TTL_MS } from '@/shared/config/constants';
import { getFromCache, setToCache } from '@/shared/lib/cache';

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat: number;
  lon: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

export async function fetchNearbyPlaces(
  lat: number,
  lon: number,
  radiusMeters: number,
): Promise<OverpassElement[]> {
  const cacheKey = `overpass_${Math.round(lat * 100) / 100}_${Math.round(lon * 100) / 100}_${radiusMeters}`;
  const cached = getFromCache<OverpassElement[]>(cacheKey, OVERPASS_CACHE_TTL_MS);
  if (cached) return cached;

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="bar"](around:${radiusMeters},${lat},${lon});
      node["amenity"="pub"](around:${radiusMeters},${lat},${lon});
      node["amenity"="nightclub"](around:${radiusMeters},${lat},${lon});
      node["shop"="alcohol"](around:${radiusMeters},${lat},${lon});
      node["shop"="wine"](around:${radiusMeters},${lat},${lon});
      node["shop"="beer"](around:${radiusMeters},${lat},${lon});
      node["shop"="convenience"](around:${radiusMeters},${lat},${lon});
      way["amenity"="bar"](around:${radiusMeters},${lat},${lon});
      way["amenity"="pub"](around:${radiusMeters},${lat},${lon});
      way["amenity"="nightclub"](around:${radiusMeters},${lat},${lon});
      way["shop"="alcohol"](around:${radiusMeters},${lat},${lon});
      way["shop"="wine"](around:${radiusMeters},${lat},${lon});
      way["shop"="beer"](around:${radiusMeters},${lat},${lon});
      way["shop"="convenience"](around:${radiusMeters},${lat},${lon});
    );
    out center body;
  `;

  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`Overpass API ошибка: ${response.status} ${response.statusText}`);
  }

  const data: OverpassResponse = await response.json();

  const elements = data.elements
    .map((el) => {
      if (el.type === 'way' && el.center) {
        return { ...el, lat: el.center.lat, lon: el.center.lon };
      }
      return el;
    })
    .filter((el) => el.lat !== undefined && el.lon !== undefined);

  setToCache(cacheKey, elements);
  return elements;
}
