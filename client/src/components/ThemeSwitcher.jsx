import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import themes from '../lib/themes';

const ThemeSwitcher = () => {
  const { themeName, setThemeName } = useContext(ThemeContext);

  return (
    <div className="theme-switcher">
      {Object.keys(themes).map((key) => {
        if (key === 'scifi') return null; // Don't show scifi
        const theme = themes[key];
        const isSelected = themeName === key;
        return (
          <div
            key={key}
            className={`theme-circle ${isSelected ? 'selected' : ''}`}
            style={{
              backgroundColor: theme.display,
              borderColor: theme.text.primary
            }}
            onClick={() => setThemeName(key)}
          />
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
