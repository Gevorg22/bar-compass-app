import { describe, it, expect, vi, afterEach } from 'vitest';
import { isOpenNow } from './openingHours';

afterEach(() => {
  vi.useRealTimers();
});

function mockDateTime(isoString: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(isoString));
}

describe('isOpenNow', () => {
  it('returns null for undefined input', () => {
    expect(isOpenNow(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(isOpenNow('')).toBeNull();
  });

  it('returns true for "24/7"', () => {
    expect(isOpenNow('24/7')).toBe(true);
  });

  it('returns true when current time is within a simple time range', () => {
    mockDateTime('2024-03-13T14:00:00');
    expect(isOpenNow('10:00-22:00')).toBe(true);
  });

  it('returns false when current time is outside a simple time range', () => {
    mockDateTime('2024-03-13T23:00:00');
    expect(isOpenNow('10:00-22:00')).toBe(false);
  });

  it('handles overnight ranges: open during night', () => {
    mockDateTime('2024-03-13T02:00:00');
    expect(isOpenNow('22:00-06:00')).toBe(true);
  });

  it('handles overnight ranges: open in evening start', () => {
    mockDateTime('2024-03-13T23:00:00');
    expect(isOpenNow('22:00-06:00')).toBe(true);
  });

  it('handles overnight ranges: closed during day', () => {
    mockDateTime('2024-03-13T12:00:00');
    expect(isOpenNow('22:00-06:00')).toBe(false);
  });

  it('returns true on matching weekday range', () => {
    mockDateTime('2024-03-13T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-22:00')).toBe(true);
  });

  it('returns null on non-matching weekday (no rule covers today)', () => {
    mockDateTime('2024-03-16T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-18:00')).toBeNull();
  });

  it('returns true on matching single day', () => {
    mockDateTime('2024-03-16T14:00:00');
    expect(isOpenNow('Sa 12:00-20:00')).toBe(true);
  });

  it('returns false when "off" applies to today', () => {
    mockDateTime('2024-03-17T14:00:00');
    expect(isOpenNow('Su off')).toBe(false);
  });

  it('does not return false from "off" when it does not apply to today', () => {
    mockDateTime('2024-03-13T14:00:00');
    const result = isOpenNow('Su off; Mo-Fr 10:00-22:00');
    expect(result).toBe(true);
  });

  it('handles multiple semicolon-separated rules', () => {
    mockDateTime('2024-03-16T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-20:00; Sa 12:00-22:00')).toBe(true);
  });

  it('returns null when no rule matches current day/time', () => {
    mockDateTime('2024-03-17T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-20:00')).toBeNull();
  });
});
