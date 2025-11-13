import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Your payment was cancelled. No charges have been made to your
              account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">What would you like to do?</h3>
              <p className="text-sm text-muted-foreground">
                You can try the payment again or continue with our free plan.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full"
                variant="default"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Try Payment Again
              </Button>

              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue with Free Plan
              </Button>

              <Button
                onClick={() => navigate("/contact")}
                variant="ghost"
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Our support team is here to assist you with any payment
              issues.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
