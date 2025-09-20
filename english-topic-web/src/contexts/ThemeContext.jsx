import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Kiểm tra theme từ localStorage, system preference hoặc mặc định là light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('english-by-topic-theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference if no saved theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return systemTheme;
  });

  // Toggle giữa light và dark theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme]);

  // Function to apply theme to DOM
  const applyTheme = useCallback((themeValue) => {
    // Set attribute for CSS variables
    document.documentElement.setAttribute('data-theme', themeValue);
    
    // Update document classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(`${themeValue}-theme`);
    
    // Optional: Update body classes for backward compatibility
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${themeValue}-theme`);
  }, []);

  // Lưu theme vào localStorage và apply vào document
  useEffect(() => {
    localStorage.setItem('english-by-topic-theme', theme);
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if no saved theme preference exists
      const savedTheme = localStorage.getItem('english-by-topic-theme');
      if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeContext;