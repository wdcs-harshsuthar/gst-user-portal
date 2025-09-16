import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  Monitor, 
  RotateCcw,
  Settings,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

interface AccessibilityToolbarProps {
  className?: string;
}

export default function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        aria-label="Show accessibility options"
      >
        <Accessibility className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 shadow-lg ${className || ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Accessibility className="h-4 w-4" />
            Accessibility Options
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse accessibility options' : 'Expand accessibility options'}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              aria-label="Hide accessibility options"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Visual Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <Label className="text-sm font-medium">Visual</Label>
            </div>

            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-sm">
                  High Contrast
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="text-sm">
                  Reduce Motion
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Font Size</Label>
                <Select 
                  value={settings.fontSize} 
                  onValueChange={(value: any) => updateSetting('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              <Label className="text-sm font-medium">Navigation</Label>
            </div>

            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-nav" className="text-sm">
                  Keyboard Navigation
                </Label>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader" className="text-sm">
                  Screen Reader Mode
                </Label>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReaderMode}
                  onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Keyboard Shortcuts Info */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Keyboard Shortcuts</Label>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Skip to main content:</span>
                <Badge variant="outline" className="text-xs">Alt + M</Badge>
              </div>
              <div className="flex justify-between">
                <span>Skip to navigation:</span>
                <Badge variant="outline" className="text-xs">Alt + N</Badge>
              </div>
              <div className="flex justify-between">
                <span>Close menus/modals:</span>
                <Badge variant="outline" className="text-xs">Escape</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

// Skip Links Component
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 bg-primary text-primary-foreground p-2 z-50 focus:relative focus:sr-only"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-0 left-32 bg-primary text-primary-foreground p-2 z-50 focus:relative focus:sr-only"
      >
        Skip to navigation
      </a>
    </div>
  );
}