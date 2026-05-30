export interface UserLocation {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
}

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';
