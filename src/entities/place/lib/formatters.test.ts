import { describe, it, expect } from 'vitest';
import { getPlaceTypeLabel, getPlaceTypeEmoji, getPlaceName } from './formatters';
import type { PlaceTypeFilter } from '../model/types';

describe('getPlaceTypeLabel', () => {
  const cases: Array<[PlaceTypeFilter, string]> = [
    ['bar', 'Бар'],
    ['pub', 'Паб'],
    ['nightclub', 'Ночной клуб'],
    ['alcohol', 'Алкомаркет'],
    ['wine', 'Винотека'],
    ['beer', 'Пивной'],
    ['convenience', '24ч'],
  ];

  cases.forEach(([type, label]) => {
    it(`returns "${label}" for type "${type}"`, () => {
      expect(getPlaceTypeLabel(type)).toBe(label);
    });
  });
});

describe('getPlaceTypeEmoji', () => {
  const cases: Array<[PlaceTypeFilter, string]> = [
    ['bar', '🍸'],
    ['pub', '🍺'],
    ['nightclub', '🎵'],
    ['alcohol', '🛒'],
    ['wine', '🍷'],
    ['beer', '🍻'],
    ['convenience', '🏪'],
  ];

  cases.forEach(([type, emoji]) => {
    it(`returns "${emoji}" for type "${type}"`, () => {
      expect(getPlaceTypeEmoji(type)).toBe(emoji);
    });
  });
});

describe('getPlaceName', () => {
  it('returns tags.name when present', () => {
    const tags = { name: 'Тёмный паб', 'name:ru': 'Другое' };
    expect(getPlaceName(tags, 'pub')).toBe('Тёмный паб');
  });

  it('returns tags["name:ru"] when name is absent', () => {
    const tags = { 'name:ru': 'Русское название' };
    expect(getPlaceName(tags, 'bar')).toBe('Русское название');
  });

  it('returns type label when both name fields are absent', () => {
    const tags = { amenity: 'bar' };
    expect(getPlaceName(tags, 'bar')).toBe('Бар');
  });

  it('returns type label for empty tags', () => {
    expect(getPlaceName({}, 'nightclub')).toBe('Ночной клуб');
  });
});
