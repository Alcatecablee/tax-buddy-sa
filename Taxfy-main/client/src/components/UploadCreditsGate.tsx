import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  AlertTriangle, 
  Crown, 
  Users,
  Gift,
  Lock,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UploadCreditsGateProps {
  onUploadAllowed?: () => void;
  onUpgradePrompt?: () => void;
  className?: string;
  showReferralSystem?: boolean;
}

export function UploadCreditsGate({ 
  onUploadAllowed, 
  onUpgradePrompt,
  className = "",
  showReferralSystem = true 
}: UploadCreditsGateProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      if (onUploadAllowed) {
        onUploadAllowed();
      }
    } finally {
      setIsUploading(false);
    }
  };

  // All uploads are now free and unlimited
  return (
    <Card className={`border-green-200 bg-green-50/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Free Unlimited Uploads
        </CardTitle>
        <CardDescription>
          Upload as many documents as you need - completely free!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Unlimited uploads available
            </span>
          </div>
          <Badge className="bg-green-600">Free</Badge>
        </div>

        <Button 
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document (Free)
            </>
          )}
        </Button>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All features are now completely free! No limits, no restrictions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
} 