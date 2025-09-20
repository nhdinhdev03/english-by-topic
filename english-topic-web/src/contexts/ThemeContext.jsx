import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Kiểm tra theme từ localStorage hoặc mặc định là light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('english-by-topic-theme');
    return savedTheme || 'light';
  });

  // Toggle giữa light và dark theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme]);

  // Lưu theme vào localStorage và apply vào document
  useEffect(() => {
    localStorage.setItem('english-by-topic-theme', theme);
    
    // Thêm class vào document để CSS có thể sử dụng
    document.documentElement.setAttribute('data-theme', theme);
    
    // Thêm class vào body cho một số styling đặc biệt
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // Set theme khi component mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
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