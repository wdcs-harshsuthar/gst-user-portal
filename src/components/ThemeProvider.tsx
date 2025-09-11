'use client';

import React, { useEffect } from 'react';
import { applyTheme } from '../config/colors';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 * Initializes the theme system and applies colors to CSS variables
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme on mount
    applyTheme();
  }, []);

  return <>{children}</>;
}

