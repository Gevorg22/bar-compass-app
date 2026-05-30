'use client';

import { motion } from 'framer-motion';

import { PLACE_TYPES } from '@/shared/config/constants';
import { Button } from '@/shared/ui/Button';
import { getPlaceTypeEmoji, getPlaceTypeLabel } from '@/entities/place/lib/formatters';
import type { PlaceTypeFilter } from '@/entities/place/model/types';

import { useFilterState } from '../model/filterModel';

import styles from './FilterBar.module.css';

export function FilterBar() {
  const { isFilterActive, toggleFilter, showOnlyOpen, toggleShowOnlyOpen } = useFilterState();

  const filters = Object.keys(PLACE_TYPES) as PlaceTypeFilter[];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className={`${styles.openNowBtn} ${showOnlyOpen ? styles.openNowActive : ''}`}
        onClick={toggleShowOnlyOpen}
        aria-pressed={showOnlyOpen}
      >
        🕐 Открыто
      </button>

      <div className={styles.separator} />

      {filters.map((filter) => (
        <Button
          key={filter}
          variant="ghost"
          size="sm"
          isActive={isFilterActive(filter)}
          onClick={() => toggleFilter(filter)}
          aria-pressed={isFilterActive(filter)}
        >
          <span>{getPlaceTypeEmoji(filter)}</span>
          <span>{getPlaceTypeLabel(filter)}</span>
        </Button>
      ))}
    </motion.div>
  );
}
