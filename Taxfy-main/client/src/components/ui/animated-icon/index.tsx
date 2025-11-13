import React from 'react';
import Lottie from 'lottie-react';

// Import Lottie animation JSON files
import moneyAnimation from './animations/money.json';
import alertAnimation from './animations/alert.json';
import calculatorAnimation from './animations/calculator.json';
import calendarAnimation from './animations/calendar.json';
import fileAnimation from './animations/file.json';
import shieldAnimation from './animations/shield.json';
import chartAnimation from './animations/chart.json';
import checkAnimation from './animations/check.json';
import clockAnimation from './animations/clock.json';
import uploadAnimation from './animations/upload.json';
import downloadAnimation from './animations/download.json';
import infoAnimation from './animations/info.json';

export type AnimatedIconType = 
  | 'money'
  | 'alert'
  | 'calculator'
  | 'calendar'
  | 'file'
  | 'shield'
  | 'chart'
  | 'check'
  | 'clock'
  | 'upload'
  | 'download'
  | 'info';

interface AnimatedIconProps {
  type: AnimatedIconType;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const animationMap = {
  money: moneyAnimation,
  alert: alertAnimation,
  calculator: calculatorAnimation,
  calendar: calendarAnimation,
  file: fileAnimation,
  shield: shieldAnimation,
  chart: chartAnimation,
  check: checkAnimation,
  clock: clockAnimation,
  upload: uploadAnimation,
  download: downloadAnimation,
  info: infoAnimation
};

export function AnimatedIcon({ 
  type, 
  size = 24, 
  loop = true, 
  autoplay = true,
  className = ''
}: AnimatedIconProps) {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <Lottie
        animationData={animationMap[type]}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Helper function to convert Lucide icon names to our animation types
export function getAnimatedIconType(lucideIconName: string): AnimatedIconType {
  const iconMap: Record<string, AnimatedIconType> = {
    'DollarSign': 'money',
    'AlertTriangle': 'alert',
    'Calculator': 'calculator',
    'Calendar': 'calendar',
    'FileText': 'file',
    'Shield': 'shield',
    'TrendingUp': 'chart',
    'CheckCircle': 'check',
    'Clock': 'clock',
    'Upload': 'upload',
    'Download': 'download',
    'Info': 'info'
  };

  return iconMap[lucideIconName] || 'info';
} 