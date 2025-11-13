import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle,
  X,
  ArrowLeft,
  Heart,
  Clock,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface CancellationOption {
  id: string;
  title: string;
  description: string;
  immediate: boolean;
  refundEligible: boolean;
}

const cancellationReasons = [
  "Too expensive for my needs",
  "Found a better alternative",
  "Not using the service enough",
  "Missing features I need",
  "Technical issues",
  "Poor customer support",
  "Temporary financial constraints",
  "Other (please specify)",
];

const retentionOffers = [
  {
    id: "discount_3m",
    title: "50% Off Next 3 Months",
    description: "Continue with all features at half price",
    badge: "Limited Time",
    icon: DollarSign,
  },
  {
    id: "pause_subscription",
    title: "Pause Subscription",
    description: "Take a break for up to 3 months, resume anytime",
    badge: "Flexible",
    icon: Clock,
  },
  {
    id: "downgrade_plan",
    title: "Switch to Basic Plan",
    description: "Keep essential features at lower cost",
    badge: "Save Money",
    icon: RefreshCw,
  },
];

export const SubscriptionCancellation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    "reason" | "retention" | "confirmation" | "processing" | "complete"
  >("reason");
  const [cancellationReason, setCancellationReason] = useState("");
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useCustomToast();
  const { currentPlan, cancelSubscription } = useSubscription();

  const nextBillingDate = new Date();
  nextBillingDate.setDate(nextBillingDate.getDate() + 30);

  const cancellationOptions: CancellationOption[] = [
    {
      id: "immediate",
      title: "Cancel Immediately",
      description:
        "End subscription now, lose access to premium features immediately",
      immediate: true,
      refundEligible: false,
    },
    {
      id: "end_of_period",
      title: "Cancel at End of Billing Period",
      description: `Keep access until ${nextBillingDate.toLocaleDateString()}, then downgrade to free`,
      immediate: false,
      refundEligible: true,
    },
  ];

  const handleReasonSubmit = () => {
    if (!cancellationReason.trim()) {
      toast({
        title: "Please select a reason",
        description: "Help us understand why you're leaving",
        variant: "destructive",
      });
      return;
    }

    if (
      cancellationReason === "Other (please specify)" &&
      !additionalFeedback.trim()
    ) {
      toast({
        title: "Please provide details",
        description: "Additional feedback is required when selecting 'Other'",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep("retention");
  };

  const handleRetentionOffer = (offerId: string) => {
    setSelectedOffer(offerId);

    switch (offerId) {
      case "discount_3m":
        toast({
          title: "Special Offer Applied!",
          description: "You'll get 50% off your next 3 billing cycles",
        });
        break;
      case "pause_subscription":
        toast({
          title: "Subscription Paused",
          description:
            "Your subscription is paused. Resume anytime in the next 3 months.",
        });
        break;
      case "downgrade_plan":
        toast({
          title: "Plan Downgraded",
          description:
            "You've been moved to our Basic plan with reduced pricing",
        });
        break;
    }

    setCurrentStep("complete");
  };

  const proceedWithCancellation = () => {
    setCurrentStep("confirmation");
  };

  const confirmCancellation = async () => {
    if (!confirmationChecked) {
      toast({
        title: "Please confirm",
        description: "Check the confirmation box to proceed",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep("processing");
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await cancelSubscription();

      // Send cancellation email
      await sendCancellationEmail();

      setCurrentStep("complete");
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description:
          "There was an error processing your cancellation. Please contact support.",
        variant: "destructive",
      });
      setCurrentStep("confirmation");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendCancellationEmail = async () => {
    // Simulate sending confirmation email
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const renderReasonStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">We're sorry to see you go</h2>
        <p className="text-muted-foreground">
          Help us improve by telling us why you're cancelling your subscription
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's the main reason for cancelling?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={cancellationReason}
            onValueChange={setCancellationReason}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent>
              {cancellationReasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <label className="text-sm font-medium">
              Additional feedback (optional)
            </label>
            <Textarea
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="Any additional comments to help us improve..."
              className="mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleReasonSubmit} className="flex-1">
              Continue
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRetentionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          Wait! We have some offers for you
        </h2>
        <p className="text-muted-foreground">
          Before you cancel, consider these alternatives that might work better
          for you
        </p>
      </div>

      <div className="grid gap-4">
        {retentionOffers.map((offer) => {
          const Icon = offer.icon;
          return (
            <Card
              key={offer.id}
              className="border border-border hover:border-primary/20 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {offer.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {offer.badge}
                    </Badge>
                    <Button onClick={() => handleRetentionOffer(offer.id)}>
                      Accept Offer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={proceedWithCancellation}>
          No thanks, proceed with cancellation
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Confirm Cancellation</h2>
        <p className="text-muted-foreground">
          This action cannot be undone. Please review the details below.
        </p>
      </div>

      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-500">Cancellation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-semibold">{currentPlan}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effective Date</p>
              <p className="font-semibold">
                {nextBillingDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <h4 className="font-semibold text-red-500 mb-2">
              What you'll lose:
            </h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                Unlimited IRP5 uploads
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                Tax deduction optimizer
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                Email support (48h response)
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                Previous tax year comparisons
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                Document vault storage
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={confirmationChecked}
              onCheckedChange={(checked) =>
                setConfirmationChecked(checked as boolean)
              }
            />
            <label htmlFor="confirm" className="text-sm">
              I understand that I will lose access to premium features and my
              subscription will be cancelled
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={!confirmationChecked}
              className="flex-1"
            >
              Confirm Cancellation
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentStep("retention")}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProcessingStep = () => (
    <Card>
      <CardContent className="text-center py-12">
        <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Processing Cancellation</h2>
        <p className="text-muted-foreground">
          Please wait while we process your cancellation request...
        </p>
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card>
      <CardContent className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {selectedOffer
            ? "Offer Applied Successfully!"
            : "Subscription Cancelled"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {selectedOffer
            ? "Your account has been updated with the new offer. Thank you for staying with us!"
            : "Your subscription has been cancelled. You can reactivate anytime."}
        </p>

        {!selectedOffer && (
          <div className="space-y-4">
            <p className="text-sm">
              You'll receive a confirmation email shortly. Your access will
              continue until{" "}
              <strong>{nextBillingDate.toLocaleDateString()}</strong>.
            </p>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Changed your mind? You can reactivate your subscription anytime
                from your account settings.
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="mt-6"
        >
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {currentStep === "reason" && renderReasonStep()}
      {currentStep === "retention" && renderRetentionStep()}
      {currentStep === "confirmation" && renderConfirmationStep()}
      {currentStep === "processing" && renderProcessingStep()}
      {currentStep === "complete" && renderCompleteStep()}
    </div>
  );
};

export default SubscriptionCancellation;
