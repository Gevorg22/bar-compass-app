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
  it('возвращает null при undefined', () => {
    expect(isOpenNow(undefined)).toBeNull();
  });

  it('возвращает null для пустой строки', () => {
    expect(isOpenNow('')).toBeNull();
  });

  it('возвращает true для "24/7"', () => {
    expect(isOpenNow('24/7')).toBe(true);
  });

  it('возвращает true, если текущее время внутри диапазона', () => {
    mockDateTime('2024-03-13T14:00:00');
    expect(isOpenNow('10:00-22:00')).toBe(true);
  });

  it('возвращает false, если текущее время вне диапазона', () => {
    mockDateTime('2024-03-13T23:00:00');
    expect(isOpenNow('10:00-22:00')).toBe(false);
  });

  it('ночной диапазон: открыто ночью', () => {
    mockDateTime('2024-03-13T02:00:00');
    expect(isOpenNow('22:00-06:00')).toBe(true);
  });

  it('ночной диапазон: открыто в начале вечернего диапазона', () => {
    mockDateTime('2024-03-13T23:00:00');
    expect(isOpenNow('22:00-06:00')).toBe(true);
  });

  it('ночной диапазон: закрыто днём', () => {
    mockDateTime('2024-03-13T12:00:00');
    expect(isOpenNow('22:00-06:00')).toBe(false);
  });

  it('возвращает true для подходящего диапазона дней недели', () => {
    mockDateTime('2024-03-13T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-22:00')).toBe(true);
  });

  it('возвращает null, если день недели не покрыт ни одним правилом', () => {
    mockDateTime('2024-03-16T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-18:00')).toBeNull();
  });

  it('возвращает true для конкретного дня недели', () => {
    mockDateTime('2024-03-16T14:00:00');
    expect(isOpenNow('Sa 12:00-20:00')).toBe(true);
  });

  it('возвращает false, если сегодня помечен как off', () => {
    mockDateTime('2024-03-17T14:00:00');
    expect(isOpenNow('Su off')).toBe(false);
  });

  it('не возвращает false от off, если он не относится к сегодняшнему дню', () => {
    mockDateTime('2024-03-13T14:00:00');
    const result = isOpenNow('Su off; Mo-Fr 10:00-22:00');
    expect(result).toBe(true);
  });

  it('обрабатывает несколько правил, разделённых точкой с запятой', () => {
    mockDateTime('2024-03-16T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-20:00; Sa 12:00-22:00')).toBe(true);
  });

  it('возвращает null, если ни одно правило не подходит', () => {
    mockDateTime('2024-03-17T14:00:00');
    expect(isOpenNow('Mo-Fr 10:00-20:00')).toBeNull();
  });
});
