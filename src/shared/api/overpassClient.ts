import { OVERPASS_API_URL } from '@/shared/config/constants';

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat: number;
  lon: number;
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
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="bar"](around:${radiusMeters},${lat},${lon});
      node["amenity"="pub"](around:${radiusMeters},${lat},${lon});
      node["amenity"="nightclub"](around:${radiusMeters},${lat},${lon});
      node["shop"="alcohol"](around:${radiusMeters},${lat},${lon});
      way["amenity"="bar"](around:${radiusMeters},${lat},${lon});
      way["amenity"="pub"](around:${radiusMeters},${lat},${lon});
      way["shop"="alcohol"](around:${radiusMeters},${lat},${lon});
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

  return data.elements.filter((el) => el.lat !== undefined && el.lon !== undefined);
}
