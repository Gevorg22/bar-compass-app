export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export const SEARCH_RADIUS_METERS = 3000;

export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 30_000,
};

export const PLACE_TYPES = {
  bar: 'bar',
  pub: 'pub',
  nightclub: 'nightclub',
  alcohol: 'alcohol',
} as const;

export const PLACE_TYPE_LABELS: Record<keyof typeof PLACE_TYPES, string> = {
  bar: 'Бар',
  pub: 'Паб',
  nightclub: 'Ночной клуб',
  alcohol: 'Алкомаркет',
};

export const RADAR_MAX_RADIUS_KM = SEARCH_RADIUS_METERS / 1000;

export const COMPASS_UPDATE_INTERVAL_MS = 100;
