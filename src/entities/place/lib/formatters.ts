import { PLACE_TYPE_LABELS } from '@/shared/config/constants';

import type { PlaceTypeFilter } from '../model/types';

export function getPlaceTypeLabel(type: PlaceTypeFilter): string {
  return PLACE_TYPE_LABELS[type];
}

export function getPlaceTypeEmoji(type: PlaceTypeFilter): string {
  const emojiMap: Record<PlaceTypeFilter, string> = {
    bar: '🍸',
    pub: '🍺',
    nightclub: '🎵',
    alcohol: '🛒',
  };
  return emojiMap[type];
}

export function getPlaceName(tags: Record<string, string>, type: PlaceTypeFilter): string {
  return tags['name'] ?? tags['name:ru'] ?? getPlaceTypeLabel(type);
}
