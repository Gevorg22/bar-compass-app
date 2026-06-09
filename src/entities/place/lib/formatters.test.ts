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
    it(`возвращает "${label}" для типа "${type}"`, () => {
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
    it(`возвращает "${emoji}" для типа "${type}"`, () => {
      expect(getPlaceTypeEmoji(type)).toBe(emoji);
    });
  });
});

describe('getPlaceName', () => {
  it('возвращает tags.name, если он есть', () => {
    const tags = { name: 'Тёмный паб', 'name:ru': 'Другое' };
    expect(getPlaceName(tags, 'pub')).toBe('Тёмный паб');
  });

  it('возвращает tags["name:ru"], если name отсутствует', () => {
    const tags = { 'name:ru': 'Русское название' };
    expect(getPlaceName(tags, 'bar')).toBe('Русское название');
  });

  it('возвращает метку типа, если оба поля имени отсутствуют', () => {
    const tags = { amenity: 'bar' };
    expect(getPlaceName(tags, 'bar')).toBe('Бар');
  });

  it('возвращает метку типа для пустых тегов', () => {
    expect(getPlaceName({}, 'nightclub')).toBe('Ночной клуб');
  });
});
