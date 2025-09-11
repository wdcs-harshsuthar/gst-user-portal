import { useEffect, useState } from 'react';
import { colorConfig, currentTheme, getThemeColors, getCSSVariables, applyTheme } from '../config/colors';

/**
 * Custom hook for theme management
 * Provides access to current theme colors and utilities
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(currentTheme);
  const [colors, setColors] = useState(getThemeColors());

  // Apply theme when it changes
  useEffect(() => {
    applyTheme();
    setColors(getThemeColors());
  }, [theme]);

  // Function to change theme
  const changeTheme = (newTheme: 'primary' | 'red' | 'green' | 'purple') => {
    setTheme(newTheme);
  };

  // Get inline styles for components
  const getInlineStyles = () => ({
    primary: {
      backgroundColor: colors.main,
      color: colorConfig.text.white,
    },
    primaryDark: {
      backgroundColor: colors.dark,
      color: colorConfig.text.white,
    },
    primaryLight: {
      backgroundColor: colors.light,
      color: colors.main,
    },
    gradient: {
      background: `linear-gradient(to right, ${colors.main}, ${colors.dark})`,
    },
    textPrimary: {
      color: colors.main,
    },
    textPrimaryDark: {
      color: colors.dark,
    },
  });

  return {
    theme,
    colors,
    changeTheme,
    getInlineStyles,
    // Convenience getters
    primaryColor: colors.main,
    primaryDark: colors.dark,
    primaryLight: colors.light,
  };
};

export default useTheme;

