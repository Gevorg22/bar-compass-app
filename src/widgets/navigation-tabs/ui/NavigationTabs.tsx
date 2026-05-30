'use client';

import { motion } from 'framer-motion';

import { useAppStore } from '@/shared/store/appStore';
import type { ViewMode } from '@/shared/store/appStore';

import styles from './NavigationTabs.module.css';

interface Tab {
  id: ViewMode;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'compass', label: 'Компас', icon: '🧭' },
  { id: 'radar', label: 'Радар', icon: '📡' },
  { id: 'map', label: 'Карта', icon: '🗺️' },
];

export function NavigationTabs() {
  const { viewMode, setViewMode } = useAppStore();

  return (
    <nav className={styles.nav} role="tablist" aria-label="Режим просмотра">
      {TABS.map((tab) => {
        const isActive = viewMode === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => setViewMode(tab.id)}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className={styles.indicator}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
