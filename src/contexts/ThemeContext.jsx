import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('thoughtbox-theme');
    if (saved && saved !== 'system') {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('thoughtbox-theme') || 'system';
  });

  // Monitor system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      if (themePreference === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themePreference]);

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('thoughtbox-theme', themePreference);
    
    // Apply theme to document with smooth transition
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Add a subtle transition effect
    root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
  }, [isDarkMode, themePreference]);

  const toggleTheme = useCallback(() => {
    if (themePreference === 'system') {
      // If currently system, switch to opposite of current system preference
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const newTheme = systemIsDark ? 'light' : 'dark';
      setThemePreference(newTheme);
      setIsDarkMode(newTheme === 'dark');
    } else {
      // Toggle between light and dark
      const newTheme = isDarkMode ? 'light' : 'dark';
      setThemePreference(newTheme);
      setIsDarkMode(newTheme === 'dark');
    }
  }, [isDarkMode, themePreference]);

  const setTheme = useCallback((theme) => {
    setThemePreference(theme);
    if (theme === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, []);

  const value = {
    isDarkMode,
    themePreference,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

