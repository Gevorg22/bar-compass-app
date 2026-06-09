import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getFromCache, setToCache } from './cache';

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('setToCache / getFromCache', () => {
  it('returns null when key is not in storage', () => {
    expect(getFromCache('missing', 5000)).toBeNull();
  });

  it('stores and retrieves a value', () => {
    setToCache('key1', { foo: 'bar' });
    expect(getFromCache<{ foo: string }>('key1', 60_000)).toEqual({ foo: 'bar' });
  });

  it('returns null when entry is expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

    setToCache('key2', [1, 2, 3]);

    vi.setSystemTime(new Date('2024-01-01T00:01:01.000Z'));

    expect(getFromCache<number[]>('key2', 60_000)).toBeNull();
  });

  it('removes expired entry from sessionStorage', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

    setToCache('key3', 'value');

    vi.setSystemTime(new Date('2024-01-01T00:01:01.000Z'));

    getFromCache<string>('key3', 60_000);
    expect(sessionStorage.getItem('key3')).toBeNull();
  });

  it('returns value when entry is within TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

    setToCache('key4', 42);

    vi.setSystemTime(new Date('2024-01-01T00:00:59.000Z'));

    expect(getFromCache<number>('key4', 60_000)).toBe(42);
  });

  it('handles invalid JSON in sessionStorage gracefully', () => {
    sessionStorage.setItem('badkey', 'not-json');
    expect(getFromCache<string>('badkey', 60_000)).toBeNull();
  });

  it('stores different value types', () => {
    setToCache('num', 123);
    setToCache('str', 'hello');
    setToCache('arr', [1, 2]);
    setToCache('obj', { a: 1 });

    expect(getFromCache<number>('num', 60_000)).toBe(123);
    expect(getFromCache<string>('str', 60_000)).toBe('hello');
    expect(getFromCache<number[]>('arr', 60_000)).toEqual([1, 2]);
    expect(getFromCache<{ a: number }>('obj', 60_000)).toEqual({ a: 1 });
  });
});
