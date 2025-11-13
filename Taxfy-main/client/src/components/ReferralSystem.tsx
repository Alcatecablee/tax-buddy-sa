import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Gift, 
  Share2, 
  Copy, 
  Mail, 
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  CheckCircle,
  Clock,
  Crown,
  Zap
} from 'lucide-react';
import { useUploadCredits } from '@/hooks/useUploadCredits';
import { useCustomToast } from '@/hooks/use-custom-toast';

interface ReferralSystemProps {
  className?: string;
  compact?: boolean;
}

export function ReferralSystem({ className = "", compact = false }: ReferralSystemProps) {
  const { 
    credits, 
    referralCode, 
    referralStats, 
    shareReferralCode, 
    getReferralLink,
    isLoading 
  } = useUploadCredits();
  const { toast } = useCustomToast();
  const [copied, setCopied] = useState(false);

  const referralLink = getReferralLink();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Referral link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: "Code copied!",
        description: "Referral code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out Taxfy - a free tax calculator that helped me get my SARS refund! Join using my referral code: ${referralCode}`;
    const url = referralLink;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Join me on Taxfy!')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`border-primary/20 bg-primary/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Earn Upload Credits</h3>
                <p className="text-xs text-muted-foreground">
                  {referralStats?.completedReferrals || 0} friends referred
                </p>
              </div>
            </div>
            <Button size="sm" onClick={shareReferralCode}>
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Credits */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Your Upload Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-primary">{credits.remaining}</div>
              <p className="text-sm text-muted-foreground">Credits available</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{referralStats?.completedReferrals || 0}</div>
              <p className="text-sm text-muted-foreground">Friends referred</p>
            </div>
          </div>
          
          {credits.remaining === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">No credits remaining</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Invite friends to earn more upload credits!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            How Referrals Work
          </CardTitle>
          <CardDescription>
            Earn 1 upload credit for every friend who signs up using your referral code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">1. Share Your Link</h3>
              <p className="text-xs text-muted-foreground">
                Send your unique referral link to friends
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">2. Friend Signs Up</h3>
              <p className="text-xs text-muted-foreground">
                They create an account using your code
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                <Gift className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">3. You Get Credit</h3>
              <p className="text-xs text-muted-foreground">
                Receive 1 upload credit instantly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Code & Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Referral
          </CardTitle>
          <CardDescription>
            Share your unique code or link with friends and family
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Referral Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Referral Code</label>
            <div className="flex gap-2">
              <Input 
                value={referralCode || ''} 
                readOnly 
                className="font-mono text-center text-lg font-bold"
              />
              <Button variant="outline" onClick={handleCopyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Referral Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Referral Link</label>
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="text-sm"
              />
              <Button 
                variant="outline" 
                onClick={handleCopyLink}
                className={copied ? 'bg-green-50 border-green-200' : ''}
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social Sharing */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Share on Social Media</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center gap-2 h-10"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('twitter')}
                className="flex items-center gap-2 h-10"
              >
                <Twitter className="w-4 h-4 text-blue-500" />
                Twitter
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('facebook')}
                className="flex items-center gap-2 h-10"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center gap-2 h-10"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
                LinkedIn
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => shareToSocial('email')}
                className="flex items-center gap-2 h-10"
              >
                <Mail className="w-4 h-4 text-gray-600" />
                Email
              </Button>
            </div>
          </div>

          {/* Native Share */}
          <Button onClick={shareReferralCode} className="w-full" size="lg">
            <Share2 className="w-4 h-4 mr-2" />
            Share Referral Link
          </Button>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      {referralStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Referral Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {(referralStats.completedReferrals || 0) + (referralStats.pendingReferrals || 0)}
                </div>
                <p className="text-xs text-blue-700">Total Invites</p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {referralStats.completedReferrals}
                </div>
                <p className="text-xs text-green-700">Total Referrals</p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {referralStats.pendingReferrals}
                </div>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">
                  {referralStats.totalEarned}
                </div>
                <p className="text-xs text-purple-700">Credits Earned</p>
              </div>
            </div>

            {referralStats.completedReferrals > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to next milestone</span>
                  <span>{referralStats.completedReferrals % 5}/5</span>
                </div>
                <Progress value={(referralStats.completedReferrals % 5) * 20} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Refer 5 friends to unlock bonus features!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 