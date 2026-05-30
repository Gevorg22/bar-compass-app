'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { formatDistance } from '@/shared/lib/geo';
import { useAppStore } from '@/shared/store/appStore';
import { getPlaceTypeEmoji, getPlaceTypeLabel } from '@/entities/place/lib/formatters';
import { useFilteredPlaces } from '@/features/filter-places';

import styles from './PlaceInfo.module.css';

export function PlaceInfo() {
  const { selectedPlace, setSelectedPlace } = useAppStore();
  const filteredPlaces = useFilteredPlaces();

  const displayPlace = selectedPlace ?? filteredPlaces[0] ?? null;

  if (!displayPlace) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${displayPlace.lat},${displayPlace.lon}&travelmode=walking`;

  const nearbyPlaces = filteredPlaces.slice(0, 5);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayPlace.id}
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={styles.mainCard}>
          <div className={styles.header}>
            <span className={styles.typeEmoji}>{getPlaceTypeEmoji(displayPlace.type)}</span>
            <div className={styles.headerText}>
              <p className={styles.placeName}>{displayPlace.name}</p>
              <p className={styles.placeType}>{getPlaceTypeLabel(displayPlace.type)}</p>
            </div>
            <div className={styles.distance}>{formatDistance(displayPlace.distanceKm)}</div>
          </div>

          <div className={styles.details}>
            {displayPlace.tags['opening_hours'] && (
              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>🕐</span>
                <span>{displayPlace.tags['opening_hours']}</span>
              </div>
            )}
            {displayPlace.tags['phone'] && (
              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>📞</span>
                <a href={`tel:${displayPlace.tags['phone']}`} className={styles.detailLink}>
                  {displayPlace.tags['phone']}
                </a>
              </div>
            )}
            {displayPlace.tags['website'] && (
              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>🌐</span>
                <a
                  href={displayPlace.tags['website']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailLink}
                >
                  Веб-сайт
                </a>
              </div>
            )}
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navigateButton}
          >
            🗺️ Открыть маршрут
          </a>
        </div>

        {nearbyPlaces.length > 1 && (
          <div className={styles.nearbySection}>
            <p className={styles.nearbyTitle}>Ближайшие</p>
            <div className={styles.nearbyList}>
              {nearbyPlaces.map((place) => (
                <button
                  key={place.id}
                  className={`${styles.nearbyItem} ${displayPlace.id === place.id ? styles.nearbyItemActive : ''}`}
                  onClick={() => setSelectedPlace(place)}
                >
                  <span>{getPlaceTypeEmoji(place.type)}</span>
                  <span className={styles.nearbyName}>{place.name}</span>
                  <span className={styles.nearbyDist}>{formatDistance(place.distanceKm)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
