import { Skeleton } from '@/shared/ui/Skeleton';

import styles from './PlaceInfoSkeleton.module.css';

export function PlaceInfoSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height="16px" />
            <div style={{ marginTop: 6 }}>
              <Skeleton width="40%" height="12px" />
            </div>
          </div>
          <Skeleton width="60px" height="22px" />
        </div>
        <div className={styles.details}>
          <Skeleton width="80%" height="13px" />
          <Skeleton width="50%" height="13px" />
        </div>
        <Skeleton height="40px" borderRadius="10px" />
      </div>
    </div>
  );
}
