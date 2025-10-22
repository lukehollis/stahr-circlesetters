import React, { createContext, useState, useMemo } from 'react';
import themes from '../lib/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('navy');

  const theme = useMemo(() => themes[themeName], [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
