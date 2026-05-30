'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import { useAppStore } from '@/shared/store/appStore';
import { Spinner } from '@/shared/ui/Spinner';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { useGeolocation } from '@/features/geolocation';
import { useFindPlaces } from '@/features/find-places';
import { FilterBar } from '@/features/filter-places';
import { ThemeToggle } from '@/features/theme';
import { CompassView } from '@/widgets/compass-view';
import { RadarView } from '@/widgets/radar-view';
import { PlaceInfo } from '@/widgets/place-info';
import { PlaceInfoSkeleton } from '@/widgets/place-info/ui/PlaceInfoSkeleton';
import { NavigationTabs } from '@/widgets/navigation-tabs';

import styles from './AppShell.module.css';

const MapView = dynamic(() => import('@/widgets/map-view').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading}>
      <Spinner size="lg" label="Загрузка карты..." />
    </div>
  ),
});

function AppInitializer() {
  useGeolocation();
  useFindPlaces();
  return null;
}

export function AppShell() {
  const { viewMode, isLoading, error, userLocation, places, setError } = useAppStore();

  const isFirstLoad = !userLocation && isLoading;
  const isPlacesLoading = !!userLocation && isLoading && places.length === 0;

  return (
    <div className={styles.shell}>
      <AppInitializer />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🧭</span>
          <span className={styles.logoText}>BarCompass</span>
        </div>

        <div className={styles.headerActions}>
          {userLocation && (
            <motion.div
              className={styles.locationBadge}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className={styles.locationDot} />
              <span>GPS</span>
            </motion.div>
          )}
          <ThemeToggle />
        </div>
      </header>

      <FilterBar />

      <main className={styles.main} id={`panel-${viewMode}`} role="tabpanel">
        {isFirstLoad ? (
          <div className={styles.loadingState}>
            <Spinner size="lg" label="Определяем местоположение..." />
          </div>
        ) : error && !userLocation ? (
          <div className={styles.errorState}>
            <ErrorMessage
              message={error}
              onRetry={() => {
                setError(null);
                window.location.reload();
              }}
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'compass' && (
              <motion.div
                key="compass"
                className={styles.viewWrapper}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <CompassView />
                <div className={styles.placeInfoWrapper}>
                  {isPlacesLoading ? <PlaceInfoSkeleton /> : <PlaceInfo />}
                </div>
              </motion.div>
            )}

            {viewMode === 'radar' && (
              <motion.div
                key="radar"
                className={styles.viewWrapper}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <RadarView />
                <div className={styles.placeInfoWrapper}>
                  {isPlacesLoading ? <PlaceInfoSkeleton /> : <PlaceInfo />}
                </div>
              </motion.div>
            )}

            {viewMode === 'map' && (
              <motion.div
                key="map"
                className={styles.mapWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MapView />
                <div className={styles.mapPlaceInfoWrapper}>
                  {isPlacesLoading ? <PlaceInfoSkeleton /> : <PlaceInfo />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <NavigationTabs />
    </div>
  );
}
