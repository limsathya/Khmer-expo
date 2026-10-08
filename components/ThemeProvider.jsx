'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'dark',
  systemTheme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveThemeValue(theme, system) {
  if (theme === 'system') return system;
  return theme === 'light' ? 'light' : 'dark';
}

function applyThemeToDOM(resolved, mode) {
  if (typeof document === 'undefined') return;
  const doc = document.documentElement;
  doc.classList.add('theme-transitioning');
  doc.setAttribute('data-theme', resolved);
  doc.setAttribute('data-theme-mode', mode);
  doc.style.colorScheme = resolved;

  try {
    document.cookie = `expo_theme=${mode}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {}

  setTimeout(() => {
    doc.classList.remove('theme-transitioning');
  }, 450);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [resolvedTheme, setResolvedTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sys = getSystemTheme();
    setSystemTheme(sys);

    let saved = null;
    try {
      saved = localStorage.getItem('expo_theme');
    } catch (e) {}

    const initialTheme = (saved === 'dark' || saved === 'light' || saved === 'system')
      ? saved
      : 'system';

    const resolved = resolveThemeValue(initialTheme, sys);

    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved, initialTheme);
    setMounted(true);

    // Watch for OS system preference changes in real-time
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newSys = e.matches ? 'dark' : 'light';
        setSystemTheme(newSys);
        setThemeState((currentTheme) => {
          if (currentTheme === 'system') {
            setResolvedTheme(newSys);
            applyThemeToDOM(newSys, 'system');
          }
          return currentTheme;
        });
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  const setTheme = useCallback((newTheme) => {
    const validTheme = (newTheme === 'dark' || newTheme === 'light' || newTheme === 'system')
      ? newTheme
      : 'system';

    const currentSys = getSystemTheme();
    setSystemTheme(currentSys);
    const resolved = resolveThemeValue(validTheme, currentSys);

    setThemeState(validTheme);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved, validTheme);

    try {
      localStorage.setItem('expo_theme', validTheme);
    } catch (e) {}
  }, []);

  const toggleTheme = useCallback(() => {
    // Cycles smoothly: system -> light -> dark -> system
    setThemeState((prev) => {
      let next = 'light';
      if (prev === 'light') next = 'dark';
      else if (prev === 'dark') next = 'system';
      else next = 'light';

      const currentSys = getSystemTheme();
      const resolved = resolveThemeValue(next, currentSys);
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved, next);

      try {
        localStorage.setItem('expo_theme', next);
      } catch (e) {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
      toggleTheme,
      mounted,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
