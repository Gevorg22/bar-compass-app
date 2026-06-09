import { describe, it, expect } from 'vitest';
import {
  toRadians,
  toDegrees,
  calculateDistance,
  calculateBearing,
  formatDistance,
  normalizeAngle,
} from './geo';

describe('toRadians', () => {
  it('конвертирует 0 градусов в 0 радиан', () => {
    expect(toRadians(0)).toBe(0);
  });

  it('конвертирует 180 градусов в PI радиан', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
  });

  it('конвертирует 90 градусов в PI/2 радиан', () => {
    expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
  });
});

describe('toDegrees', () => {
  it('конвертирует 0 радиан в 0 градусов', () => {
    expect(toDegrees(0)).toBe(0);
  });

  it('конвертирует PI радиан в 180 градусов', () => {
    expect(toDegrees(Math.PI)).toBeCloseTo(180);
  });

  it('конвертирует PI/2 радиан в 90 градусов', () => {
    expect(toDegrees(Math.PI / 2)).toBeCloseTo(90);
  });
});

describe('calculateDistance', () => {
  it('возвращает 0 для одинаковых координат', () => {
    expect(calculateDistance(55.75, 37.62, 55.75, 37.62)).toBe(0);
  });

  it('вычисляет примерное расстояние между Москвой и Санкт-Петербургом', () => {
    const dist = calculateDistance(55.75, 37.62, 59.95, 30.32);
    expect(dist).toBeGreaterThan(630);
    expect(dist).toBeLessThan(640);
  });

  it('возвращает положительное значение для любых двух разных координат', () => {
    expect(calculateDistance(0, 0, 1, 1)).toBeGreaterThan(0);
  });
});

describe('calculateBearing', () => {
  it('возвращает 0 (север), если цель строго на севере', () => {
    const bearing = calculateBearing(0, 0, 1, 0);
    expect(bearing).toBeCloseTo(0, 0);
  });

  it('возвращает 180 (юг), если цель строго на юге', () => {
    const bearing = calculateBearing(1, 0, 0, 0);
    expect(bearing).toBeCloseTo(180, 0);
  });

  it('возвращает 90 (восток), если цель строго на востоке', () => {
    const bearing = calculateBearing(0, 0, 0, 1);
    expect(bearing).toBeCloseTo(90, 0);
  });

  it('возвращает 270 (запад), если цель строго на западе', () => {
    const bearing = calculateBearing(0, 1, 0, 0);
    expect(bearing).toBeCloseTo(270, 0);
  });

  it('возвращает значение в диапазоне [0, 360)', () => {
    const bearing = calculateBearing(55.75, 37.62, 59.95, 30.32);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});

describe('formatDistance', () => {
  it('форматирует расстояние менее километра в метрах', () => {
    expect(formatDistance(0.5)).toBe('500 м');
  });

  it('форматирует 0 км как 0 метров', () => {
    expect(formatDistance(0)).toBe('0 м');
  });

  it('форматирует расстояние от 1 км с одним знаком после запятой', () => {
    expect(formatDistance(1)).toBe('1.0 км');
    expect(formatDistance(1.55)).toBe('1.6 км');
    expect(formatDistance(2.34)).toBe('2.3 км');
  });

  it('корректно округляет метры', () => {
    expect(formatDistance(0.9999)).toBe('1000 м');
  });
});

describe('normalizeAngle', () => {
  it('возвращает значение без изменений, если угол уже в [0, 360)', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(180)).toBe(180);
    expect(normalizeAngle(359)).toBe(359);
  });

  it('приводит 360 к 0', () => {
    expect(normalizeAngle(360)).toBe(0);
  });

  it('нормализует отрицательные углы', () => {
    expect(normalizeAngle(-90)).toBe(270);
    expect(normalizeAngle(-1)).toBe(359);
  });

  it('нормализует углы больше 360', () => {
    expect(normalizeAngle(450)).toBe(90);
    expect(normalizeAngle(720)).toBe(0);
  });
});
