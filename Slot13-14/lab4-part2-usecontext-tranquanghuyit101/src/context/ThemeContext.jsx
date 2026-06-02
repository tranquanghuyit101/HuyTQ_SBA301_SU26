import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { themes, STORAGE_KEY } from '../data/themeConfig';

const ThemeContext = createContext(null);

function readInitialMode() {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readInitialMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemPrefersDark(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const resolvedTheme = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
  const colors = themes[resolvedTheme];

  const changeMode = (newMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, newMode);
    }
  };

  const value = useMemo(
    () => ({ mode, resolvedTheme, colors, changeMode }),
    [mode, resolvedTheme, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}

