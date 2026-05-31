'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('bar-compass-theme') as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const initial = getInitialTheme();
    document.documentElement.setAttribute('data-theme', initial);
    const id = setTimeout(() => setThemeState(initial), 0);
    return () => clearTimeout(id);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('bar-compass-theme', next);
      } catch {}
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
