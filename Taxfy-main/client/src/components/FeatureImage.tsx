import React from 'react';
import { 
  Monitor, 
  Calculator, 
  FileText, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Shield,
  Zap,
  Target,
  PiggyBank,
  Building,
  Briefcase,
  Clock,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Globe,
  Smartphone,
  Upload,
  Download
} from 'lucide-react';

interface FeatureImageProps {
  type: 'sars-efiling' | 'tax-planning' | 'refund-check' | 'tax-season' | 'documents' | 'deductions' | 'default' | 'warning' | 'money' | 'calendar';
  title: string;
  className?: string;
  theme?: string;
}

const imageConfigs = {
  'sars-efiling': {
    gradient: 'from-blue-500/20 via-purple-500/15 to-indigo-500/20',
    overlayGradient: 'from-blue-500/10 to-purple-500/10',
    icon: Monitor,
    iconColor: 'text-blue-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Shield, position: 'top-4 right-4', color: 'text-purple-400/30', size: 'w-8 h-8' },
      { icon: Globe, position: 'bottom-4 left-4', color: 'text-blue-400/30', size: 'w-6 h-6' },
      { icon: Smartphone, position: 'top-1/4 left-8', color: 'text-indigo-400/20', size: 'w-10 h-10' }
    ],
    subtitle: 'Digital Tax Filing Made Simple'
  },
  'tax-planning': {
    gradient: 'from-emerald-500/20 via-teal-500/15 to-green-500/20',
    overlayGradient: 'from-emerald-500/10 to-teal-500/10',
    icon: TrendingUp,
    iconColor: 'text-emerald-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Target, position: 'top-4 right-4', color: 'text-teal-400/30', size: 'w-8 h-8' },
      { icon: PiggyBank, position: 'bottom-4 left-4', color: 'text-green-400/30', size: 'w-8 h-8' },
      { icon: BarChart3, position: 'top-1/3 left-6', color: 'text-emerald-400/20', size: 'w-12 h-12' },
      { icon: Lightbulb, position: 'bottom-1/3 right-6', color: 'text-teal-400/25', size: 'w-10 h-10' }
    ],
    subtitle: 'Strategic Wealth Optimization'
  },
  'refund-check': {
    gradient: 'from-orange-500/20 via-amber-500/15 to-yellow-500/20',
    overlayGradient: 'from-orange-500/10 to-amber-500/10',
    icon: DollarSign,
    iconColor: 'text-orange-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Calculator, position: 'top-4 right-4', color: 'text-amber-400/30', size: 'w-8 h-8' },
      { icon: CheckCircle, position: 'bottom-4 left-4', color: 'text-yellow-400/30', size: 'w-8 h-8' },
      { icon: Zap, position: 'top-1/4 left-8', color: 'text-orange-400/25', size: 'w-10 h-10' }
    ],
    subtitle: 'Discover Your Tax Refund'
  },
  'tax-season': {
    gradient: 'from-red-500/20 via-pink-500/15 to-rose-500/20',
    overlayGradient: 'from-red-500/10 to-pink-500/10',
    icon: Calendar,
    iconColor: 'text-red-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Clock, position: 'top-4 right-4', color: 'text-pink-400/30', size: 'w-8 h-8' },
      { icon: FileText, position: 'bottom-4 left-4', color: 'text-rose-400/30', size: 'w-8 h-8' },
      { icon: Building, position: 'top-1/3 left-6', color: 'text-red-400/20', size: 'w-10 h-10' }
    ],
    subtitle: 'Tax Season 2025 Guide'
  },
  'documents': {
    gradient: 'from-violet-500/20 via-purple-500/15 to-fuchsia-500/20',
    overlayGradient: 'from-violet-500/10 to-purple-500/10',
    icon: FileText,
    iconColor: 'text-violet-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Upload, position: 'top-4 right-4', color: 'text-purple-400/30', size: 'w-8 h-8' },
      { icon: Download, position: 'bottom-4 left-4', color: 'text-fuchsia-400/30', size: 'w-8 h-8' },
      { icon: Shield, position: 'top-1/4 left-8', color: 'text-violet-400/25', size: 'w-10 h-10' },
      { icon: CheckCircle, position: 'bottom-1/3 right-6', color: 'text-purple-400/20', size: 'w-8 h-8' }
    ],
    subtitle: 'Essential Tax Documents'
  },
  'deductions': {
    gradient: 'from-cyan-500/20 via-sky-500/15 to-blue-500/20',
    overlayGradient: 'from-cyan-500/10 to-sky-500/10',
    icon: Calculator,
    iconColor: 'text-cyan-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Briefcase, position: 'top-4 right-4', color: 'text-sky-400/30', size: 'w-8 h-8' },
      { icon: PiggyBank, position: 'bottom-4 left-4', color: 'text-blue-400/30', size: 'w-8 h-8' },
      { icon: TrendingUp, position: 'top-1/3 left-6', color: 'text-cyan-400/25', size: 'w-10 h-10' }
    ],
    subtitle: 'Optimize Your Deductions'
  },
  'default': {
    gradient: 'from-slate-500/20 via-gray-500/15 to-zinc-500/20',
    overlayGradient: 'from-slate-500/10 to-gray-500/10',
    icon: FileText,
    iconColor: 'text-slate-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Calculator, position: 'top-4 right-4', color: 'text-gray-400/30', size: 'w-8 h-8' },
      { icon: Shield, position: 'bottom-4 left-4', color: 'text-zinc-400/30', size: 'w-8 h-8' }
    ],
    subtitle: 'Tax Insights & Guidance'
  },
  'warning': {
    gradient: 'from-yellow-500/20 via-orange-500/15 to-red-500/20',
    overlayGradient: 'from-yellow-500/10 to-orange-500/10',
    icon: Shield,
    iconColor: 'text-yellow-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Calculator, position: 'top-4 right-4', color: 'text-orange-400/30', size: 'w-8 h-8' },
      { icon: CheckCircle, position: 'bottom-4 left-4', color: 'text-red-400/30', size: 'w-8 h-8' }
    ],
    subtitle: 'Important Tax Information'
  },
  'money': {
    gradient: 'from-green-500/20 via-emerald-500/15 to-teal-500/20',
    overlayGradient: 'from-green-500/10 to-emerald-500/10',
    icon: DollarSign,
    iconColor: 'text-green-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: PiggyBank, position: 'top-4 right-4', color: 'text-emerald-400/30', size: 'w-8 h-8' },
      { icon: TrendingUp, position: 'bottom-4 left-4', color: 'text-teal-400/30', size: 'w-8 h-8' }
    ],
    subtitle: 'Financial Planning'
  },
  'calendar': {
    gradient: 'from-purple-500/20 via-violet-500/15 to-indigo-500/20',
    overlayGradient: 'from-purple-500/10 to-violet-500/10',
    icon: Calendar,
    iconColor: 'text-purple-500/60',
    iconSize: 'w-32 h-32',
    decorativeElements: [
      { icon: Clock, position: 'top-4 right-4', color: 'text-violet-400/30', size: 'w-8 h-8' },
      { icon: CheckCircle, position: 'bottom-4 left-4', color: 'text-indigo-400/30', size: 'w-8 h-8' }
    ],
    subtitle: 'Important Dates'
  }
};

export const FeatureImage: React.FC<FeatureImageProps> = ({
  type,
  title,
  className = ""
}) => {
  const config = imageConfigs[type] || imageConfigs.default;
  const MainIcon = config.icon;

  return (
    <div className={`aspect-video bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center mb-12 relative overflow-hidden border border-white/10 shadow-lg ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      </div>

      {/* Overlay Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.overlayGradient}`}></div>

      {/* Decorative Elements */}
      {config.decorativeElements.map((element, index) => {
        const ElementIcon = element.icon;
        return (
          <div key={index} className={`absolute ${element.position}`}>
            <ElementIcon className={`${element.size} ${element.color} animate-pulse`} style={{
              animationDelay: `${index * 0.5}s`,
              animationDuration: '3s'
            }} />
          </div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        <div className="mb-6 relative">
          <MainIcon className={`${config.iconSize} ${config.iconColor} mx-auto drop-shadow-lg`} />
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MainIcon className={`${config.iconSize} ${config.iconColor} opacity-20 blur-xl`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground/80 tracking-wide uppercase">
            {config.subtitle}
          </p>
          <h1 className="text-lg font-bold text-foreground/90 leading-tight max-w-md mx-auto">
            {title}
          </h1>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureImage; 