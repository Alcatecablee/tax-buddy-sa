import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Target,
  Clock,
  Eye,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveDashboardProps {
  className?: string;
}

interface AnimatedMetric {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  change: number;
  changeText: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  shortcut?: string;
}

interface HelpBubble {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  visible: boolean;
}

export function InteractiveDashboard({ className }: InteractiveDashboardProps) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [helpBubbles, setHelpBubbles] = useState<HelpBubble[]>([]);
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false);

  const metrics: AnimatedMetric[] = [
    {
      id: 'calculations',
      label: 'Tax Calculations',
      value: 2847,
      displayValue: '2,847',
      change: 12.5,
      changeText: '+12.5%',
      icon: BarChart3,
      color: 'text-blue-600',
      trend: 'up'
    },
    {
      id: 'refunds',
      label: 'Refunds Identified',
      value: 1856000,
      displayValue: 'R1.86M',
      change: 8.3,
      changeText: '+8.3%',
      icon: DollarSign,
      color: 'text-green-600',
      trend: 'up'
    },
    {
      id: 'users',
      label: 'Active Users',
      value: 4521,
      displayValue: '4,521',
      change: 15.7,
      changeText: '+15.7%',
      icon: Users,
      color: 'text-purple-600',
      trend: 'up'
    },
    {
      id: 'processing',
      label: 'Processing Time',
      value: 1.2,
      displayValue: '1.2s',
      change: -23.1,
      changeText: '-23.1%',
      icon: Zap,
      color: 'text-orange-600',
      trend: 'down'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'upload',
      label: 'Upload IRP5',
      description: 'Start a new tax calculation',
      icon: Target,
      action: () => window.location.href = '/upload',
      shortcut: 'Ctrl+U'
    },
    {
      id: 'manual',
      label: 'Manual Entry',
      description: 'Enter tax data manually',
      icon: Activity,
      action: () => window.location.href = '/manual-entry',
      shortcut: 'Ctrl+M'
    },
    {
      id: 'dashboard',
      label: 'View Dashboard',
      description: 'Access your tax dashboard',
      icon: BarChart3,
      action: () => window.location.href = '/dashboard',
      shortcut: 'Ctrl+D'
    },
    {
      id: 'help',
      label: 'Get Help',
      description: 'Access help and support',
      icon: HelpCircle,
      action: () => setShowHelp(!showHelp),
      shortcut: 'F1'
    }
  ];

  useEffect(() => {
    // Initialize contextual help bubbles
    const bubbles: HelpBubble[] = [
      {
        id: 'metrics-help',
        title: 'Real-time Metrics',
        content: 'These metrics update automatically to show your tax calculation performance and refund opportunities.',
        position: { x: 20, y: 120 },
        visible: false
      },
      {
        id: 'actions-help',
        title: 'Quick Actions',
        content: 'Use these shortcuts to quickly access the most common tax calculation features.',
        position: { x: 20, y: 300 },
        visible: false
      }
    ];
    setHelpBubbles(bubbles);
  }, []);

  const toggleHelpBubble = (id: string) => {
    setHelpBubbles(prev => 
      prev.map(bubble => 
        bubble.id === id 
          ? { ...bubble, visible: !bubble.visible }
          : { ...bubble, visible: false }
      )
    );
  };

  const handleMetricHover = (metricId: string) => {
    setActiveMetric(metricId);
  };

  const handleMetricLeave = () => {
    setActiveMetric(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Interactive Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interactive Dashboard</h2>
          <p className="text-muted-foreground">Real-time tax calculation insights</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showHelp ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {showHelp ? "Hide Help" : "Show Help"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickActionsExpanded(!quickActionsExpanded)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {quickActionsExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </div>

      {/* Animated Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isActive = activeMetric === metric.id;
          
          return (
            <Card 
              key={metric.id}
              className={cn(
                "transition-all duration-300 cursor-pointer",
                isActive 
                  ? "scale-105 shadow-lg border-primary" 
                  : "hover:scale-102 hover:shadow-md"
              )}
              onMouseEnter={() => handleMetricHover(metric.id)}
              onMouseLeave={handleMetricLeave}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <Icon className={cn("h-4 w-4", metric.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {metric.displayValue}
                </div>
                <div className="flex items-center text-xs">
                  <TrendingUp 
                    className={cn(
                      "h-3 w-3 mr-1",
                      metric.trend === 'up' ? "text-green-600" : "text-red-600"
                    )}
                  />
                  <span className={cn(
                    "font-medium",
                    metric.trend === 'up' ? "text-green-600" : "text-red-600"
                  )}>
                    {metric.changeText}
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
                
                {/* Progress animation */}
                {isActive && (
                  <div className="mt-2 w-full bg-muted rounded-full h-1 overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", metric.color.replace('text', 'bg'))}
                      style={{ width: `${Math.min(metric.change + 50, 100)}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Tooltips */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Action Tooltips
            </CardTitle>
            <Badge variant="outline">Press shortcuts</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-4 transition-all duration-300",
            quickActionsExpanded 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
              : "grid-cols-2 md:grid-cols-4"
          )}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  className={cn(
                    "h-auto p-4 flex flex-col items-start text-left transition-all duration-200",
                    "hover:bg-primary/10 hover:scale-105"
                  )}
                  onClick={action.action}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-medium">{action.label}</span>
                  </div>
                  {quickActionsExpanded && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {action.description}
                    </p>
                  )}
                  {action.shortcut && (
                    <Badge variant="secondary" className="text-xs">
                      {action.shortcut}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contextual Help Bubbles */}
      {showHelp && (
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Info className="w-5 h-5" />
                Contextual Help System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toggleHelpBubble('metrics-help')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Learn about Metrics
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toggleHelpBubble('actions-help')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Quick Actions Guide
                </Button>
              </div>
              
              {helpBubbles.filter(bubble => bubble.visible).map((bubble) => (
                <Card key={bubble.id} className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                          {bubble.title}
                        </h4>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          {bubble.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Micro-Interaction Feedback System */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
            <CheckCircle className="w-5 h-5" />
            Micro-Interaction Feedback System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Real-time Validation</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Instant feedback on form inputs and calculations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Progress Indicators</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Visual progress tracking for multi-step processes
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Smart Notifications</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Contextual notifications that guide user actions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}