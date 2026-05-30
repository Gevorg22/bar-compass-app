import type { OverpassElement } from '@/shared/api/overpassClient';
import { fetchNearbyPlaces } from '@/shared/api/overpassClient';
import { SEARCH_RADIUS_METERS } from '@/shared/config/constants';
import { calculateBearing, calculateDistance } from '@/shared/lib/geo';
import { getPlaceName } from '@/entities/place/lib/formatters';
import type { Place, PlaceTypeFilter } from '@/entities/place/model/types';

function detectPlaceType(tags: Record<string, string>): PlaceTypeFilter | null {
  if (tags['amenity'] === 'bar') return 'bar';
  if (tags['amenity'] === 'pub') return 'pub';
  if (tags['amenity'] === 'nightclub') return 'nightclub';
  if (tags['shop'] === 'alcohol') return 'alcohol';
  return null;
}

function mapElementToPlace(
  element: OverpassElement,
  userLat: number,
  userLon: number,
): Place | null {
  const type = detectPlaceType(element.tags);
  if (!type) return null;

  const distanceKm = calculateDistance(userLat, userLon, element.lat, element.lon);
  const bearing = calculateBearing(userLat, userLon, element.lat, element.lon);

  return {
    id: element.id,
    name: getPlaceName(element.tags, type),
    type,
    lat: element.lat,
    lon: element.lon,
    distanceKm,
    bearing,
    tags: element.tags,
  };
}

export async function loadNearbyPlaces(userLat: number, userLon: number): Promise<Place[]> {
  const elements = await fetchNearbyPlaces(userLat, userLon, SEARCH_RADIUS_METERS);

  const places = elements
    .map((el) => mapElementToPlace(el, userLat, userLon))
    .filter((p): p is Place => p !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return places;
}
