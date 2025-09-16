import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Activity, 
  Clock, 
  Wifi, 
  HardDrive, 
  Cpu, 
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  networkLatency: number;
  errorRate: number;
  timestamp: Date;
}

interface PerformanceIssue {
  type: 'warning' | 'error' | 'info';
  message: string;
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
}

export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetrics[] = [];
  private listeners: ((metrics: PerformanceMetrics[]) => void)[] = [];
  private issues: PerformanceIssue[] = [];

  private constructor() {
    this.startTracking();
  }

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  private startTracking() {
    // Track page load performance
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.addMetric('loadTime', loadTime);
      });

      // Track memory usage periodically
      setInterval(() => {
        this.trackMemoryUsage();
        this.trackNetworkLatency();
      }, 30000); // Every 30 seconds
    }
  }

  private trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      this.addMetric('memoryUsage', usage);
    }
  }

  private async trackNetworkLatency() {
    const start = performance.now();
    try {
      // Simple ping to same domain
      await fetch('/ping', { method: 'HEAD', cache: 'no-cache' });
      const latency = performance.now() - start;
      this.addMetric('networkLatency', latency);
    } catch (error) {
      console.warn('Network latency check failed:', error);
    }
  }

  addMetric(type: keyof PerformanceMetrics, value: number) {
    const currentMetrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      networkLatency: 0,
      errorRate: 0,
      timestamp: new Date(),
      [type]: value
    };

    // Get the latest metrics and update
    const latest = this.metrics[this.metrics.length - 1];
    if (latest && this.isSameTimeWindow(latest.timestamp, currentMetrics.timestamp)) {
      Object.assign(latest, { [type]: value, timestamp: currentMetrics.timestamp });
    } else {
      this.metrics.push(currentMetrics);
    }

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    this.checkThresholds(type, value);
    this.notifyListeners();
  }

  private isSameTimeWindow(date1: Date, date2: Date): boolean {
    return Math.abs(date1.getTime() - date2.getTime()) < 5000; // 5 second window
  }

  private checkThresholds(metric: keyof PerformanceMetrics, value: number) {
    const thresholds = {
      loadTime: { warning: 3000, error: 5000 },
      renderTime: { warning: 100, error: 200 },
      memoryUsage: { warning: 70, error: 90 },
      networkLatency: { warning: 1000, error: 3000 },
      errorRate: { warning: 1, error: 5 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return;

    if (value > threshold.error) {
      this.addIssue({
        type: 'error',
        message: this.getIssueMessage(metric, value, 'error'),
        metric,
        value,
        threshold: threshold.error
      });
    } else if (value > threshold.warning) {
      this.addIssue({
        type: 'warning',
        message: this.getIssueMessage(metric, value, 'warning'),
        metric,
        value,
        threshold: threshold.warning
      });
    }
  }

  private getIssueMessage(metric: keyof PerformanceMetrics, value: number, level: string): string {
    const messages = {
      loadTime: `Page load time (${value.toFixed(0)}ms) is ${level}`,
      renderTime: `Render time (${value.toFixed(0)}ms) is ${level}`,
      memoryUsage: `Memory usage (${value.toFixed(1)}%) is ${level}`,
      networkLatency: `Network latency (${value.toFixed(0)}ms) is ${level}`,
      errorRate: `Error rate (${value.toFixed(1)}%) is ${level}`
    };
    return messages[metric] || `${metric} performance is ${level}`;
  }

  private addIssue(issue: PerformanceIssue) {
    // Remove duplicate issues
    this.issues = this.issues.filter(i => 
      !(i.metric === issue.metric && i.type === issue.type)
    );
    
    this.issues.push(issue);
    
    // Keep only last 10 issues
    if (this.issues.length > 10) {
      this.issues = this.issues.slice(-10);
    }
  }

  subscribe(listener: (metrics: PerformanceMetrics[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.metrics]));
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  getAverageMetrics(count: number = 10): Partial<PerformanceMetrics> {
    const recentMetrics = this.metrics.slice(-count);
    if (recentMetrics.length === 0) return {};

    const averages: Partial<PerformanceMetrics> = {};
    const keys = ['loadTime', 'renderTime', 'memoryUsage', 'networkLatency', 'errorRate'] as const;
    
    keys.forEach(key => {
      const values = recentMetrics.map(m => m[key]).filter(v => v > 0);
      if (values.length > 0) {
        averages[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });

    return averages;
  }

  getIssues(): PerformanceIssue[] {
    return [...this.issues];
  }

  clearIssues() {
    this.issues = [];
    this.notifyListeners();
  }
}

// React hook for using performance tracking
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  
  useEffect(() => {
    const tracker = PerformanceTracker.getInstance();
    
    const unsubscribe = tracker.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setIssues(tracker.getIssues());
    });

    // Initial load
    setMetrics(tracker['metrics']);
    setIssues(tracker.getIssues());

    return unsubscribe;
  }, []);

  const trackRender = useCallback((componentName: string, renderTime: number) => {
    PerformanceTracker.getInstance().addMetric('renderTime', renderTime);
  }, []);

  const trackError = useCallback(() => {
    const tracker = PerformanceTracker.getInstance();
    const currentRate = tracker.getLatestMetrics()?.errorRate || 0;
    tracker.addMetric('errorRate', currentRate + 1);
  }, []);

  return {
    metrics,
    issues,
    trackRender,
    trackError,
    latestMetrics: metrics[metrics.length - 1] || null,
    averageMetrics: PerformanceTracker.getInstance().getAverageMetrics(),
    clearIssues: () => PerformanceTracker.getInstance().clearIssues()
  };
}

// Performance monitoring component
export function PerformanceMonitor({ enabled = true }: { enabled?: boolean }) {
  const { latestMetrics, averageMetrics, issues, clearIssues } = usePerformanceMonitor();

  if (!enabled) return null;

  const getPerformanceScore = () => {
    if (!latestMetrics) return 0;
    
    let score = 100;
    if (latestMetrics.loadTime > 3000) score -= 20;
    if (latestMetrics.memoryUsage > 70) score -= 15;
    if (latestMetrics.networkLatency > 1000) score -= 10;
    if (latestMetrics.errorRate > 1) score -= 25;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatMetric = (value: number | undefined, unit: string) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(value < 10 ? 1 : 0)}${unit}`;
  };

  const score = getPerformanceScore();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Performance Monitor
          <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
            Score: {score}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Overall Score</span>
            <span className={`font-medium ${getScoreColor(score)}`}>
              {score}/100
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Load Time</span>
            </div>
            <div className="font-medium">
              {formatMetric(averageMetrics.loadTime, 'ms')}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>Memory</span>
            </div>
            <div className="font-medium">
              {formatMetric(averageMetrics.memoryUsage, '%')}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              <span>Network</span>
            </div>
            <div className="font-medium">
              {formatMetric(averageMetrics.networkLatency, 'ms')}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <span>Errors</span>
            </div>
            <div className="font-medium">
              {formatMetric(averageMetrics.errorRate, '%')}
            </div>
          </div>
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Issues</span>
              <Button variant="ghost" size="sm" onClick={clearIssues}>
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {issues.slice(0, 3).map((issue, index) => (
                <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                  <div className="flex items-center gap-2">
                    {issue.type === 'error' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Info className="h-3 w-3" />
                    )}
                    <AlertDescription className="text-xs">
                      {issue.message}
                    </AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Higher-order component to track component render performance
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: P) {
    const { trackRender } = usePerformanceMonitor();
    
    useEffect(() => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        trackRender(componentName, end - start);
      };
    });

    return <WrappedComponent {...props} />;
  };
}