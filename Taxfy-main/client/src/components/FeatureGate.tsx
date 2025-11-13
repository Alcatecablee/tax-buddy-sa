import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Lock, 
  Zap, 
  Star, 
  Shield, 
  FileText, 
  Upload, 
  Download,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRICING_CONFIG, PricingTier } from '@/types/pricing';

interface FeatureGateProps {
  feature: string;
  requiredPlan?: PricingTier;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  className?: string;
}

interface FeatureInfo {
  name: string;
  description: string;
  icon: ReactNode;
  requiredPlan: PricingTier;
  benefits: string[];
}

const FEATURE_DEFINITIONS: Record<string, FeatureInfo> = {
  unlimited_uploads: {
    name: 'Unlimited Uploads',
    description: 'Upload as many tax documents as you need without restrictions',
    icon: <Upload className="h-5 w-5" />,
    requiredPlan: 'starter',
    benefits: [
      'No monthly upload limits',
      'Process multiple IRP5 forms',
      'Bulk document processing',
      'Priority processing queue'
    ]
  },
  document_vault: {
    name: 'Document Vault',
    description: 'Secure cloud storage for all your tax documents',
    icon: <FileText className="h-5 w-5" />,
    requiredPlan: 'starter',
    benefits: [
      'Encrypted document storage',
      'Access from anywhere',
      'Automatic backups',
      'Document organization tools'
    ]
  },
  priority_support: {
    name: 'Priority Support',
    description: 'Get help when you need it most with priority customer support',
    icon: <Star className="h-5 w-5" />,
    requiredPlan: 'pro',
    benefits: [
      '24/7 priority support',
      'Dedicated support team',
      'Phone and email support',
      'Faster response times'
    ]
  },
  api_access: {
    name: 'API Access',
    description: 'Integrate tax calculations into your own applications',
    icon: <Zap className="h-5 w-5" />,
    requiredPlan: 'pro',
    benefits: [
      'RESTful API access',
      'Bulk processing capabilities',
      'Custom integrations',
      'Developer documentation'
    ]
  },
  white_label: {
    name: 'White Label',
    description: 'Brand the platform with your own company identity',
    icon: <Sparkles className="h-5 w-5" />,
    requiredPlan: 'pro',
    benefits: [
      'Custom branding',
      'Your logo and colors',
      'Custom domain',
      'Remove Taxfy branding'
    ]
  },
  client_management: {
    name: 'Client Management',
    description: 'Manage multiple clients and their tax calculations',
    icon: <Shield className="h-5 w-5" />,
    requiredPlan: 'pro',
    benefits: [
      'Client dashboard',
      'Multi-client access',
      'Client data separation',
      'Practitioner tools'
    ]
  },
  bulk_processing: {
    name: 'Bulk Processing',
    description: 'Process multiple tax returns simultaneously',
    icon: <Download className="h-5 w-5" />,
    requiredPlan: 'pro',
    benefits: [
      'Batch processing',
      'Multiple file uploads',
      'Automated calculations',
      'Bulk export options'
    ]
  },
  custom_branding: {
    name: 'Custom Branding',
    description: 'Full customization of the platform appearance',
    icon: <Crown className="h-5 w-5" />,
    requiredPlan: 'business',
    benefits: [
      'Complete visual customization',
      'Custom CSS and themes',
      'Branded reports',
      'White-label solution'
    ]
  },
  dedicated_manager: {
    name: 'Dedicated Account Manager',
    description: 'Personal account manager for enterprise support',
    icon: <Star className="h-5 w-5" />,
    requiredPlan: 'business',
    benefits: [
      'Dedicated account manager',
      'Custom onboarding',
      'Training sessions',
      'Strategic consultation'
    ]
  }
};

export function FeatureGate({ 
  feature, 
  requiredPlan, 
  children, 
  fallback, 
  showUpgrade = true,
  className = '' 
}: FeatureGateProps) {
  // All features are now free and accessible
  return <>{children}</>;
}

// Convenience components for specific features
export function UnlimitedUploadsGate({ children, ...props }: Omit<FeatureGateProps, 'feature'>) {
  return <>{children}</>;
}

export function DocumentVaultGate({ children, ...props }: Omit<FeatureGateProps, 'feature'>) {
  return <>{children}</>;
}

export function PrioritySupportGate({ children, ...props }: Omit<FeatureGateProps, 'feature'>) {
  return <>{children}</>;
}

export function APIAccessGate({ children, ...props }: Omit<FeatureGateProps, 'feature'>) {
  return <>{children}</>;
}

export function ClientManagementGate({ children, ...props }: Omit<FeatureGateProps, 'feature'>) {
  return <>{children}</>;
}

// Feature gating utilities - all features are now available
export function useFeatureGating() {
  const checkFeatures = (features: string[]) => {
    // All features are available
    return features.reduce((acc, feature) => ({ ...acc, [feature]: true }), {});
  };

  const getRequiredPlan = (feature: string) => {
    return FEATURE_DEFINITIONS[feature]?.requiredPlan || 'free';
  };

  const getFeatureInfo = (feature: string) => {
    return FEATURE_DEFINITIONS[feature];
  };

  return {
    checkFeatures,
    getRequiredPlan,
    getFeatureInfo,
    // All features are available
    canAccessFeature: () => true,
    hasAccess: () => true
  };
} 