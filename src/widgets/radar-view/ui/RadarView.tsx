'use client';

import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';

import { RADAR_MAX_RADIUS_KM } from '@/shared/config/constants';
import { useAppStore } from '@/shared/store/appStore';
import { getPlaceTypeEmoji } from '@/entities/place/lib/formatters';
import type { Place } from '@/entities/place/model/types';
import { useFilteredPlaces } from '@/features/filter-places';

import styles from './RadarView.module.css';

const RADAR_SIZE = 300;
const RADAR_RADIUS = RADAR_SIZE / 2;

const ZOOM_LEVELS = [0.5, 1, 2, RADAR_MAX_RADIUS_KM] as const;

interface RadarDotProps {
  place: Place;
  visibleRadiusKm: number;
  isSelected: boolean;
  onSelect: () => void;
}

function RadarDot({ place, visibleRadiusKm, isSelected, onSelect }: RadarDotProps) {
  const distanceRatio = Math.min(place.distanceKm / visibleRadiusKm, 1);
  const bearingRad = (place.bearing * Math.PI) / 180;

  const x = RADAR_RADIUS + distanceRatio * RADAR_RADIUS * Math.sin(bearingRad);
  const y = RADAR_RADIUS - distanceRatio * RADAR_RADIUS * Math.cos(bearingRad);

  const isOutOfRange = place.distanceKm > visibleRadiusKm;

  return (
    <motion.button
      className={`${styles.dot} ${isSelected ? styles.dotSelected : ''} ${isOutOfRange ? styles.dotFaded : ''}`}
      style={{ left: x, top: y }}
      onClick={onSelect}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isOutOfRange ? 0.35 : 1 }}
      whileHover={{ scale: 1.4 }}
      whileTap={{ scale: 0.9 }}
      title={place.name}
      aria-label={`${place.name}, ${place.distanceKm < 1 ? `${Math.round(place.distanceKm * 1000)} м` : `${place.distanceKm.toFixed(1)} км`}`}
    >
      <span className={styles.dotEmoji}>{getPlaceTypeEmoji(place.type)}</span>
      {isSelected && (
        <motion.div
          className={styles.dotPing}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

export function RadarView() {
  const { selectedPlace, setSelectedPlace } = useAppStore();
  const filteredPlaces = useFilteredPlaces();
  const scanAngleRef = useRef(0);
  const [scanAngle, setScanAngle] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(ZOOM_LEVELS.length - 1);

  const visibleRadiusKm = ZOOM_LEVELS[zoomIndex];
  const canZoomIn = zoomIndex > 0;
  const canZoomOut = zoomIndex < ZOOM_LEVELS.length - 1;

  useAnimationFrame((_time, delta) => {
    scanAngleRef.current = (scanAngleRef.current + delta * 0.06) % 360;
    setScanAngle(scanAngleRef.current);
  });

  const scanRad = (scanAngle * Math.PI) / 180;
  const scanEndX = RADAR_RADIUS + RADAR_RADIUS * Math.sin(scanRad);
  const scanEndY = RADAR_RADIUS - RADAR_RADIUS * Math.cos(scanRad);

  const ringLabels = [0.25, 0.5, 0.75, 1].map((ratio) => ({
    ratio,
    km: (visibleRadiusKm * ratio).toFixed(ratio === 1 ? 0 : 1),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.radarOuter}>
        <div className={styles.radarWrapper}>
          <svg className={styles.radarSvg} viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}>
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.05" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle
              cx={RADAR_RADIUS}
              cy={RADAR_RADIUS}
              r={RADAR_RADIUS - 1}
              fill="url(#radarGlow)"
              stroke="var(--color-accent)"
              strokeOpacity="0.3"
              strokeWidth="1"
            />

            {ringLabels.map(({ ratio, km }) => (
              <g key={ratio}>
                <circle
                  cx={RADAR_RADIUS}
                  cy={RADAR_RADIUS}
                  r={(RADAR_RADIUS - 2) * ratio}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeOpacity="0.15"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={RADAR_RADIUS + (RADAR_RADIUS - 2) * ratio + 3}
                  y={RADAR_RADIUS - 2}
                  fontSize="7"
                  fill="var(--color-accent)"
                  fillOpacity="0.4"
                  className={styles.cardinalText}
                >
                  {km}км
                </text>
              </g>
            ))}

            <line
              x1={RADAR_RADIUS}
              y1="2"
              x2={RADAR_RADIUS}
              y2={RADAR_SIZE - 2}
              stroke="var(--color-accent)"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
            <line
              x1="2"
              y1={RADAR_RADIUS}
              x2={RADAR_SIZE - 2}
              y2={RADAR_RADIUS}
              stroke="var(--color-accent)"
              strokeOpacity="0.1"
              strokeWidth="1"
            />

            <line
              x1={RADAR_RADIUS}
              y1={RADAR_RADIUS}
              x2={scanEndX}
              y2={scanEndY}
              stroke="var(--color-accent)"
              strokeOpacity="0.8"
              strokeWidth="2"
            />

            <text
              x={RADAR_RADIUS}
              y={12}
              textAnchor="middle"
              className={styles.cardinalText}
              fill="var(--color-accent)"
              fontSize="10"
            >
              С
            </text>
            <text
              x={RADAR_RADIUS}
              y={RADAR_SIZE - 4}
              textAnchor="middle"
              className={styles.cardinalText}
              fill="var(--color-text-muted)"
              fontSize="10"
            >
              Ю
            </text>
            <text
              x={12}
              y={RADAR_RADIUS + 4}
              textAnchor="middle"
              className={styles.cardinalText}
              fill="var(--color-text-muted)"
              fontSize="10"
            >
              З
            </text>
            <text
              x={RADAR_SIZE - 12}
              y={RADAR_RADIUS + 4}
              textAnchor="middle"
              className={styles.cardinalText}
              fill="var(--color-text-muted)"
              fontSize="10"
            >
              В
            </text>
          </svg>

          <div className={styles.dotsLayer}>
            <AnimatePresence>
              {filteredPlaces.map((place) => (
                <RadarDot
                  key={place.id}
                  place={place}
                  visibleRadiusKm={visibleRadiusKm}
                  isSelected={selectedPlace?.id === place.id}
                  onSelect={() => setSelectedPlace(place)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredPlaces.length === 0 && (
            <div className={styles.emptyOverlay}>
              <p>Нет мест</p>
            </div>
          )}
        </div>

        <div className={styles.zoomControls}>
          <motion.button
            className={styles.zoomBtn}
            onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
            disabled={!canZoomIn}
            whileTap={{ scale: 0.9 }}
            aria-label="Приблизить"
          >
            +
          </motion.button>
          <motion.button
            className={styles.zoomBtn}
            onClick={() => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
            disabled={!canZoomOut}
            whileTap={{ scale: 0.9 }}
            aria-label="Отдалить"
          >
            −
          </motion.button>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} />
          {filteredPlaces.length} мест найдено
        </span>
        <motion.span
          key={visibleRadiusKm}
          className={styles.legendRadius}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {visibleRadiusKm} км радиус
        </motion.span>
      </div>
    </div>
  );
}
