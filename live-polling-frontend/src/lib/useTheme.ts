import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'app-theme';

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem(THEME_KEY, mode);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      if (stored && stored !== theme) {
        setThemeState(stored);
      }
    };
    
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      if (customEvent.detail !== theme) {
        setThemeState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('theme-change', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('theme-change', handleCustomEvent);
    };
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: mode }));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const mode = prev === 'dark' ? 'light' : 'dark';
      window.dispatchEvent(new CustomEvent('theme-change', { detail: mode }));
      return mode;
    });
  }, []);

  return { theme, setTheme, toggleTheme };
}
