'use client';

import { useCallback, useEffect, useRef } from 'react';

import { GEOLOCATION_OPTIONS } from '@/shared/config/constants';
import { useAppStore } from '@/shared/store/appStore';

export function useGeolocation() {
  const { setUserLocation, setError, setLoading } = useAppStore();
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback(
    (position: GeolocationPosition) => {
      setUserLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      setError(null);
      setLoading(false);
    },
    [setUserLocation, setError, setLoading],
  );

  const handleError = useCallback(
    (err: GeolocationPositionError) => {
      const messages: Record<number, string> = {
        1: 'Доступ к геолокации запрещён. Разрешите в настройках браузера.',
        2: 'Не удалось определить местоположение. Проверьте GPS.',
        3: 'Превышено время ожидания геолокации.',
      };
      setError(messages[err.code] ?? 'Неизвестная ошибка геолокации.');
      setLoading(false);
    },
    [setError, setLoading],
  );

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Ваш браузер не поддерживает геолокацию.');
      return;
    }

    setLoading(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      GEOLOCATION_OPTIONS,
    );
  }, [handleSuccess, handleError, setError, setLoading]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    startWatching();
    return () => stopWatching();
  }, [startWatching, stopWatching]);

  return { startWatching, stopWatching };
}
