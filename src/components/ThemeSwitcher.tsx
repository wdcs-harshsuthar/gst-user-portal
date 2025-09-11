'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTheme } from '../hooks/useTheme';

/**
 * Theme Switcher Component
 * Allows users to change the theme and see colors update dynamically
 */
export default function ThemeSwitcher() {
  const { theme, changeTheme, getInlineStyles } = useTheme();

  const themes = [
    { id: 'primary', name: 'Blue (Default)', color: 'hsl(230 100% 60%)' },
    { id: 'red', name: 'Red', color: 'hsl(0 84% 60%)' },
    { id: 'green', name: 'Green', color: 'hsl(142 76% 36%)' },
    { id: 'purple', name: 'Purple', color: 'hsl(262 83% 58%)' },
  ] as const;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getInlineStyles().primary.backgroundColor }}
          />
          Dynamic Theme System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Change the theme to see colors update across the entire application:
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {themes.map((themeOption) => (
            <Button
              key={themeOption.id}
              variant={theme === themeOption.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeTheme(themeOption.id as any)}
              className="flex items-center gap-2"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: themeOption.color }}
              />
              {themeOption.name}
            </Button>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Current theme colors:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getInlineStyles().primary.backgroundColor }}
              />
              <span className="text-xs">Primary: {getInlineStyles().primary.backgroundColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getInlineStyles().primaryDark.backgroundColor }}
              />
              <span className="text-xs">Primary Dark: {getInlineStyles().primaryDark.backgroundColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getInlineStyles().gradient.background }}
              />
              <span className="text-xs">Gradient: {getInlineStyles().gradient.background}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

