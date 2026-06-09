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
  it('converts 0 degrees to 0 radians', () => {
    expect(toRadians(0)).toBe(0);
  });

  it('converts 180 degrees to PI radians', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
  });

  it('converts 90 degrees to PI/2 radians', () => {
    expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
  });
});

describe('toDegrees', () => {
  it('converts 0 radians to 0 degrees', () => {
    expect(toDegrees(0)).toBe(0);
  });

  it('converts PI radians to 180 degrees', () => {
    expect(toDegrees(Math.PI)).toBeCloseTo(180);
  });

  it('converts PI/2 radians to 90 degrees', () => {
    expect(toDegrees(Math.PI / 2)).toBeCloseTo(90);
  });
});

describe('calculateDistance', () => {
  it('returns 0 for identical coordinates', () => {
    expect(calculateDistance(55.75, 37.62, 55.75, 37.62)).toBe(0);
  });

  it('calculates approximate distance between Moscow and Saint Petersburg', () => {
    const dist = calculateDistance(55.75, 37.62, 59.95, 30.32);
    expect(dist).toBeGreaterThan(630);
    expect(dist).toBeLessThan(640);
  });

  it('returns a positive value for any two distinct coordinates', () => {
    expect(calculateDistance(0, 0, 1, 1)).toBeGreaterThan(0);
  });
});

describe('calculateBearing', () => {
  it('returns 0 (north) when target is directly north', () => {
    const bearing = calculateBearing(0, 0, 1, 0);
    expect(bearing).toBeCloseTo(0, 0);
  });

  it('returns 180 (south) when target is directly south', () => {
    const bearing = calculateBearing(1, 0, 0, 0);
    expect(bearing).toBeCloseTo(180, 0);
  });

  it('returns 90 (east) when target is directly east', () => {
    const bearing = calculateBearing(0, 0, 0, 1);
    expect(bearing).toBeCloseTo(90, 0);
  });

  it('returns 270 (west) when target is directly west', () => {
    const bearing = calculateBearing(0, 1, 0, 0);
    expect(bearing).toBeCloseTo(270, 0);
  });

  it('returns a value in range [0, 360)', () => {
    const bearing = calculateBearing(55.75, 37.62, 59.95, 30.32);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});

describe('formatDistance', () => {
  it('formats sub-kilometer distances in metres', () => {
    expect(formatDistance(0.5)).toBe('500 м');
  });

  it('formats 0 km as 0 metres', () => {
    expect(formatDistance(0)).toBe('0 м');
  });

  it('formats distances >= 1 km with one decimal in km', () => {
    expect(formatDistance(1)).toBe('1.0 км');
    expect(formatDistance(1.55)).toBe('1.6 км');
    expect(formatDistance(2.34)).toBe('2.3 км');
  });

  it('rounds metres correctly', () => {
    expect(formatDistance(0.9999)).toBe('1000 м');
  });
});

describe('normalizeAngle', () => {
  it('returns same value for angles already in [0, 360)', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(180)).toBe(180);
    expect(normalizeAngle(359)).toBe(359);
  });

  it('wraps 360 to 0', () => {
    expect(normalizeAngle(360)).toBe(0);
  });

  it('wraps negative angles', () => {
    expect(normalizeAngle(-90)).toBe(270);
    expect(normalizeAngle(-1)).toBe(359);
  });

  it('wraps angles greater than 360', () => {
    expect(normalizeAngle(450)).toBe(90);
    expect(normalizeAngle(720)).toBe(0);
  });
});
