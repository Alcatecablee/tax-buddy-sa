import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Copy, 
  MessageCircle,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  hashtags?: string[];
  className?: string;
  showEncouragement?: boolean;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description,
  hashtags = [],
  className = "",
  showEncouragement = true
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareData = {
    title,
    text: description,
    url
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Thanks for sharing! 🎉",
          description: "You're helping others discover valuable tax insights.",
        });
      } else {
        // Fallback to copy link
        handleCopyLink();
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        handleCopyLink();
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied! 📋",
        description: "Share this valuable tax guide with friends and family.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually from your browser.",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string, url: string) => {
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    
    // Show encouraging toast
    const messages = {
      facebook: "Thanks for sharing on Facebook! 📘",
      twitter: "Thanks for tweeting this! 🐦", 
      linkedin: "Thanks for sharing on LinkedIn! 💼",
      whatsapp: "Thanks for sharing on WhatsApp! 💬",
      email: "Thanks for sharing via email! 📧"
    };
    
    toast({
      title: messages[platform as keyof typeof messages] || "Thanks for sharing! 🎉",
      description: "You're helping others save money on their taxes!",
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showEncouragement && (
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-primary mb-2">
            💡 Found this helpful? Share the knowledge!
          </h3>
          <p className="text-sm text-primary/80">
            Help your friends and family save money on their taxes by sharing this guide.
          </p>
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Share this article:</span>
        
        {/* Native Share Button (mobile) */}
        <Button
          onClick={handleNativeShare}
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        {/* Social Media Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleSocialShare('facebook', shareLinks.facebook)}
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
          </Button>

          <Button
            onClick={() => handleSocialShare('twitter', shareLinks.twitter)}
            variant="outline"
            size="sm"
            className="hover:bg-sky-50 hover:border-sky-300 dark:hover:bg-sky-950/20"
          >
            <Twitter className="w-4 h-4 text-sky-500" />
          </Button>

          <Button
            onClick={() => handleSocialShare('linkedin', shareLinks.linkedin)}
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20"
          >
            <Linkedin className="w-4 h-4 text-blue-700" />
          </Button>

          <Button
            onClick={() => handleSocialShare('whatsapp', shareLinks.whatsapp)}
            variant="outline"
            size="sm"
            className="hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/20"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
          </Button>

          <Button
            onClick={() => handleSocialShare('email', shareLinks.email)}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-950/20"
          >
            <Mail className="w-4 h-4 text-gray-600" />
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-950/20"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Hashtags for easy copying */}
      {hashtags.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Suggested hashtags: </span>
          <span className="font-mono">{hashtagString}</span>
        </div>
      )}
    </div>
  );
};

export default ShareButtons; 