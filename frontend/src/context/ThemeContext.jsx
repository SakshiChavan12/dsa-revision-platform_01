// src/context/ThemeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Default to 'dark'
  const [theme, setTheme] = useState('dark');

  // 2. Load saved theme from localStorage on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('dsa-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      // Apply theme to the root HTML tag GLOBALLY
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Ensure dark is set by default
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // 3. Toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dsa-theme', newTheme);
    // Apply theme to the root HTML tag GLOBALLY
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);