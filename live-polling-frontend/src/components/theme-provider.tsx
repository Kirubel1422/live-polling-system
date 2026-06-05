import React, { useEffect } from 'react'
import { useTheme, ThemeMode } from '@/lib/useTheme'

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({ children, defaultTheme = 'dark', storageKey = 'app-theme' }: ThemeProviderProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      setTheme(defaultTheme);
    }
  }, [defaultTheme, storageKey, setTheme]);

  return <>{children}</>;
}
