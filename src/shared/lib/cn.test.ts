import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('возвращает пустую строку при вызове без аргументов', () => {
    expect(cn()).toBe('');
  });

  it('возвращает один класс без изменений', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('объединяет несколько классов через пробел', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('отфильтровывает falsy-значения', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
    expect(cn('foo', false, 'bar')).toBe('foo bar');
  });

  it('возвращает пустую строку, если все значения falsy', () => {
    expect(cn(undefined, null, false, '')).toBe('');
  });
});
