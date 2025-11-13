import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  type: 'navigation' | 'resource' | 'measure' | 'mark';
}

export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0
  });
  
  const startTimeRef = useRef<number>(performance.now());
  const renderStartRef = useRef<number>(performance.now());

  // Track component mount and render time
  useEffect(() => {
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStartRef.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime
    }));

    // Mark component as loaded
    if (performance.mark) {
      performance.mark(`${componentName}-loaded`);
    }

    // Get memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize
      }));
    }

    return () => {
      // Cleanup performance marks
      if (performance.clearMarks) {
        performance.clearMarks(`${componentName}-loaded`);
      }
    };
  }, [componentName]);

  // Track page load time
  useEffect(() => {
    const handleLoad = () => {
      const loadTime = performance.now() - startTimeRef.current;
      setMetrics(prev => ({
        ...prev,
        loadTime
      }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Track user interactions
  const trackInteraction = (interactionName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        interactionTime: duration
      }));

      // Log performance data in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance: ${componentName} - ${interactionName}`, {
          duration: `${duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        });
      }

      // Mark interaction
      if (performance.mark && performance.measure) {
        const markName = `${componentName}-${interactionName}`;
        performance.mark(`${markName}-start`);
        performance.mark(`${markName}-end`);
        performance.measure(markName, `${markName}-start`, `${markName}-end`);
      }
    };
  };

  // Get performance entries
  const getPerformanceEntries = (): PerformanceEntry[] => {
    if (!performance.getEntries) return [];
    
    return performance.getEntries()
      .filter(entry => entry.name.includes(componentName))
      .map(entry => ({
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
        type: entry.entryType as any
      }));
  };

  // Check if performance is slow
  const isSlowPerformance = () => {
    return metrics.renderTime > 100 || metrics.loadTime > 3000;
  };

  // Get performance grade
  const getPerformanceGrade = (): 'excellent' | 'good' | 'fair' | 'poor' => {
    const totalTime = metrics.loadTime + metrics.renderTime;
    
    if (totalTime < 1000) return 'excellent';
    if (totalTime < 2000) return 'good';
    if (totalTime < 3000) return 'fair';
    return 'poor';
  };

  // Log performance summary
  const logPerformanceSummary = () => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`Performance Summary: ${componentName}`);
      console.log('Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
      console.log('Render Time:', `${metrics.renderTime.toFixed(2)}ms`);
      console.log('Last Interaction:', `${metrics.interactionTime.toFixed(2)}ms`);
      console.log('Grade:', getPerformanceGrade());
      if (metrics.memoryUsage) {
        console.log('Memory Usage:', `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
      console.groupEnd();
    }
  };

  return {
    metrics,
    trackInteraction,
    getPerformanceEntries,
    isSlowPerformance,
    getPerformanceGrade,
    logPerformanceSummary
  };
}

// Hook for tracking specific operations
export function useOperationTimer(operationName: string) {
  const [duration, setDuration] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const startTimeRef = useRef<number>(0);

  const start = () => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    setDuration(0);
  };

  const stop = () => {
    if (isRunning) {
      const endTime = performance.now();
      const operationDuration = endTime - startTimeRef.current;
      setDuration(operationDuration);
      setIsRunning(false);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Operation "${operationName}" completed in ${operationDuration.toFixed(2)}ms`);
      }

      return operationDuration;
    }
    return 0;
  };

  const reset = () => {
    setDuration(0);
    setIsRunning(false);
    startTimeRef.current = 0;
  };

  return {
    duration,
    isRunning,
    start,
    stop,
    reset
  };
} 