/**
 * Centralized Color Configuration
 * 
 * This file defines all colors used throughout the application.
 * Change colors here to update them across the entire project.
 */

export const colorConfig = {
  // Primary Brand Colors
  primary: {
    // Main brand color (currently blue)
    main: 'hsl(230 100% 60%)', // #4F63D2
    // Darker variant for gradients
    dark: 'hsl(220 91% 38%)',  // #1E3A8A
    // Lighter variant
    light: 'hsl(230 100% 95%)', // #E8EBFF
  },

  // Alternative Brand Colors (for theming)
  alternative: {
    // Red theme (as requested)
    red: {
      main: 'rgba(30, 58, 138, var(--tw-bg-opacity, 1))',   // Custom blue color
      dark: 'rgba(20, 40, 100, var(--tw-bg-opacity, 1))',   // Darker variant
      light: 'rgba(200, 220, 255, var(--tw-bg-opacity, 1))', // Lighter variant
    },
    // Green theme
    green: {
      main: 'hsl(142 76% 36%)', // #059669
      dark: 'hsl(142 76% 26%)', // #047857
      light: 'hsl(142 76% 95%)', // #ECFDF5
    },
    // Purple theme
    purple: {
      main: 'hsl(262 83% 58%)', // #8B5CF6
      dark: 'hsl(262 83% 48%)', // #7C3AED
      light: 'hsl(262 83% 95%)', // #F3F4F6
    },
  },

  // UI Colors
  ui: {
    background: 'hsl(0 0% 100%)',     // White
    foreground: 'hsl(0 0% 14.5%)',   // Dark gray
    card: 'hsl(0 0% 100%)',          // White
    border: 'hsl(0 0% 90%)',         // Light gray
    muted: 'hsl(240 5% 96%)',        // Very light gray
    destructive: 'hsl(0 84% 60%)',   // Red
  },

  // Text Colors
  text: {
    primary: 'hsl(0 0% 14.5%)',      // Dark gray
    secondary: 'hsl(0 0% 45%)',      // Medium gray
    muted: 'hsl(0 0% 60%)',          // Light gray
    white: 'hsl(0 0% 100%)',         // White
  },

  // Status Colors
  status: {
    success: 'hsl(142 76% 36%)',     // Green
    warning: 'hsl(38 92% 50%)',      // Orange
    error: 'hsl(0 84% 60%)',         // Red
    info: 'hsl(230 100% 60%)',       // Blue
  },
} as const;

// Current theme (change this to switch themes)
export const currentTheme = 'red'; // 'primary' | 'red' | 'green' | 'purple'

// Helper function to get current theme colors
export const getThemeColors = () => {
  if (currentTheme === 'primary') {
    return colorConfig.primary;
  }
  return colorConfig.alternative[currentTheme as keyof typeof colorConfig.alternative];
};

// Helper function to get CSS custom property values
export const getCSSVariables = () => {
  const themeColors = getThemeColors();
  
  // Helper function to extract HSL values from color strings
  const extractHSL = (color: string) => {
    if (color.includes('rgba')) {
      // For RGBA colors, convert to HSL equivalent
      // rgba(30, 58, 138, var(--tw-bg-opacity, 1)) -> 220 64% 33%
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        // Convert RGB to HSL (simplified conversion)
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const diff = max - min;
        
        let h = 0;
        if (diff !== 0) {
          if (max === rNorm) h = ((gNorm - bNorm) / diff) % 6;
          else if (max === gNorm) h = (bNorm - rNorm) / diff + 2;
          else h = (rNorm - gNorm) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const l = (max + min) / 2;
        const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
        
        return `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      }
    }
    return color.replace('hsl(', '').replace(')', '');
  };
  
  return {
    '--primary': extractHSL(themeColors.main),
    '--primary-foreground': colorConfig.text.white.replace('hsl(', '').replace(')', ''),
    '--secondary': extractHSL(themeColors.light),
    '--secondary-foreground': extractHSL(themeColors.main),
    '--accent': extractHSL(themeColors.light),
    '--accent-foreground': extractHSL(themeColors.main),
    '--ring': extractHSL(themeColors.main),
    '--sidebar': extractHSL(themeColors.main),
    '--sidebar-foreground': colorConfig.text.white.replace('hsl(', '').replace(')', ''),
    '--sidebar-primary': colorConfig.text.white.replace('hsl(', '').replace(')', ''),
    '--sidebar-primary-foreground': extractHSL(themeColors.main),
    '--sidebar-accent': extractHSL(themeColors.dark),
    '--sidebar-accent-foreground': colorConfig.text.white.replace('hsl(', '').replace(')', ''),
    '--sidebar-border': extractHSL(themeColors.dark),
    '--sidebar-ring': colorConfig.text.white.replace('hsl(', '').replace(')', ''),
    '--chart-1': extractHSL(themeColors.main),
  };
};

// Helper function to apply theme to document
export const applyTheme = () => {
  const cssVariables = getCSSVariables();
  const root = document.documentElement;
  
  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Export individual color getters for convenience
export const getPrimaryColor = () => getThemeColors().main;
export const getPrimaryDark = () => getThemeColors().dark;
export const getPrimaryLight = () => getThemeColors().light;
