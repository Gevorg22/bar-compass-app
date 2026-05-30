'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppStore } from '@/shared/store/appStore';

interface DeviceCompassState {
  isSupported: boolean;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<void>;
}

declare global {
  interface DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  }
  interface Window {
    DeviceOrientationEvent: typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
  }
}

type ExtendedDeviceOrientationEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

export function useDeviceCompass(): DeviceCompassState {
  const { setDeviceHeading } = useAppStore();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const lastHeadingRef = useRef<number>(0);
  const listeningRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const alpha = event.alpha;
      if (alpha === null) return;

      const extended = event as ExtendedDeviceOrientationEvent;
      const heading =
        extended.webkitCompassHeading !== undefined
          ? extended.webkitCompassHeading
          : (360 - alpha) % 360;

      const diff = Math.abs(heading - lastHeadingRef.current);
      if (diff < 1 || diff > 359) return;

      lastHeadingRef.current = heading;
      setDeviceHeading(heading);
    },
    [setDeviceHeading],
  );

  const startListening = useCallback(() => {
    if (listeningRef.current) return;
    listeningRef.current = true;
    window.addEventListener('deviceorientation', handleOrientation, true);
    setIsPermissionGranted(true);
  }, [handleOrientation]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return;

    const DeviceOrientation = window.DeviceOrientationEvent;

    if (typeof DeviceOrientation.requestPermission === 'function') {
      const permission = await DeviceOrientation.requestPermission();
      if (permission === 'granted') {
        startListening();
      }
    } else {
      startListening();
    }
  }, [isSupported, startListening]);

  useEffect(() => {
    if (!isSupported) return;

    const DeviceOrientation = window.DeviceOrientationEvent;

    if (typeof DeviceOrientation.requestPermission !== 'function') {
      setTimeout(startListening, 0);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      listeningRef.current = false;
    };
  }, [isSupported, handleOrientation, startListening]);

  return { isSupported, isPermissionGranted, requestPermission };
}
