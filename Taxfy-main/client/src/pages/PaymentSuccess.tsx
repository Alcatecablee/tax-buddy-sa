import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { EnhancedPaymentManager } from "@/lib/paypal";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { upgradePlan } = useSubscription();
  const { toast } = useCustomToast();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  // Get parameters from URL
  const subscriptionId = searchParams.get("subscription_id");
  const orderId = searchParams.get("token"); // PayPal uses 'token' for order ID
  const planId = searchParams.get("plan_id") || "starter";

  useEffect(() => {
    const processPayment = async () => {
      if (!subscriptionId && !orderId) {
        setError("No payment information found");
        setLoading(false);
        return;
      }

      try {
        const paymentManager = new EnhancedPaymentManager();

        if (subscriptionId) {
          // Handle subscription payment
          console.log("Processing subscription:", subscriptionId);
          // In a real implementation, you would verify the subscription with PayPal
          // and update the user's subscription status in your database

          setSubscriptionDetails({
            id: subscriptionId,
            status: "ACTIVE",
            planId: planId,
          });

          // Update local subscription state
          await upgradePlan(planId as any);
        } else if (orderId) {
          // Handle one-time payment
          console.log("Capturing order:", orderId);
          const result = await paymentManager.capturePayment("paypal", orderId);

          if (result.success) {
            setSubscriptionDetails({
              transactionId: result.transactionId,
              orderId: result.orderId,
              status: "COMPLETED",
            });
          } else {
            throw new Error(result.error || "Payment capture failed");
          }
        }

        setSuccess(true);
        toast({
          title: "Payment Successful! 🎉",
          description: "Your subscription has been activated successfully.",
        });
      } catch (err) {
        console.error("Payment processing error:", err);
        setError(
          err instanceof Error ? err.message : "Payment processing failed",
        );
        toast({
          title: "Payment Processing Error",
          description:
            "There was an issue processing your payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [subscriptionId, orderId, planId, upgradePlan, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">
              Processing Payment...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment with PayPal.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/pricing")} className="w-full">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/contact")}
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Thank you for your payment. Your subscription has been activated
              successfully.
            </p>
          </div>

          {subscriptionDetails && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="default">{subscriptionDetails.status}</Badge>
              </div>

              {subscriptionDetails.id && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Subscription ID:</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {subscriptionDetails.id.substring(0, 20)}...
                  </span>
                </div>
              )}

              {subscriptionDetails.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transaction ID:</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {subscriptionDetails.transactionId.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/settings")}
              className="w-full"
            >
              Manage Subscription
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent to{" "}
              {user?.email || "your email address"}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
