'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { normalizeAngle } from '@/shared/lib/geo';
import { useAppStore } from '@/shared/store/appStore';
import { getPlaceTypeEmoji } from '@/entities/place/lib/formatters';
import { useDeviceCompass } from '@/features/device-compass';
import { useFilteredPlaces } from '@/features/filter-places';

import styles from './CompassView.module.css';

const CARDINAL_DIRECTIONS = [
  { label: 'С', angle: 0 },
  { label: 'СВ', angle: 45 },
  { label: 'В', angle: 90 },
  { label: 'ЮВ', angle: 135 },
  { label: 'Ю', angle: 180 },
  { label: 'ЮЗ', angle: 225 },
  { label: 'З', angle: 270 },
  { label: 'СЗ', angle: 315 },
];

const BASE_SIZE = 300;

export function CompassView() {
  const { selectedPlace, deviceHeading } = useAppStore();
  const { isSupported, isPermissionGranted, requestPermission } = useDeviceCompass();
  const filteredPlaces = useFilteredPlaces();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setScale(entry.contentRect.width / BASE_SIZE);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const r = (BASE_SIZE / 2) * scale;

  const targetPlace = selectedPlace ?? filteredPlaces[0] ?? null;

  const needleAngle = targetPlace ? normalizeAngle(targetPlace.bearing - deviceHeading) : 0;

  const compassRotation = -deviceHeading;

  return (
    <div className={styles.container}>
      <div className={styles.compassWrapper} ref={wrapperRef}>
        <motion.div
          className={styles.compassRing}
          style={{ rotate: compassRotation }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          animate={{ rotate: compassRotation }}
        >
          {CARDINAL_DIRECTIONS.map(({ label, angle }) => {
            const isMain = ['С', 'Ю', 'В', 'З'].includes(label);
            const offset = isMain ? r * 0.787 : r * 0.72;
            return (
              <div
                key={label}
                className={styles.cardinal}
                style={{
                  transform: `rotate(${angle}deg) translateY(-${offset}px) rotate(-${angle}deg)`,
                }}
              >
                <span className={`${styles.cardinalLabel} ${label === 'С' ? styles.north : ''}`}>
                  {label}
                </span>
              </div>
            );
          })}

          <div className={styles.outerRingDecorations}>
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.tick} ${i % 9 === 0 ? styles.tickMajor : ''}`}
                style={{ transform: `rotate(${i * 10}deg) translateY(-${r * 0.92}px)` }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.needle}
          style={{ height: r * 1.33 }}
          animate={{ rotate: needleAngle }}
          transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        >
          <div className={styles.needleHead} />
          <div className={styles.needleTail} />
        </motion.div>

        <div className={styles.centerDot} />

        {targetPlace && (
          <div className={styles.targetEmoji}>{getPlaceTypeEmoji(targetPlace.type)}</div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {targetPlace ? (
          <motion.div
            key={targetPlace.id}
            className={styles.placeInfo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <p className={styles.placeName}>{targetPlace.name}</p>
            <p className={styles.placeDistance}>
              {targetPlace.distanceKm < 1
                ? `${Math.round(targetPlace.distanceKm * 1000)} м`
                : `${targetPlace.distanceKm.toFixed(1)} км`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Поблизости нет мест</p>
            <p className={styles.emptySubtext}>Попробуйте расширить фильтры</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isSupported && !isPermissionGranted && (
        <motion.button
          className={styles.permissionButton}
          onClick={requestPermission}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          🧭 Включить компас
        </motion.button>
      )}
    </div>
  );
}
