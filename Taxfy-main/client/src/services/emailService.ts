// Email service that communicates with server-side email API
interface EmailConfig {
  apiUrl: string;
  supportEmail: string;
  appUrl: string;
}

const emailConfig: EmailConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "/api",
  supportEmail: "support@taxfy.co.za",
  appUrl: import.meta.env.VITE_APP_URL || window.location.origin,
};

interface PlanData {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  isRecurring: boolean;
  billing?: string;
}

interface PaymentData {
  transactionId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  timestamp: string;
}

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send payment confirmation email via server API
   */
  async sendPaymentConfirmation(
    user: UserData,
    plan: PlanData,
    payment: PaymentData,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${emailConfig.apiUrl}/email/payment-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user,
            plan,
            payment,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Failed to send payment confirmation email:", result);
        return false;
      }

      console.log("✅ Payment confirmation email sent:", result.emailId);
      return true;
    } catch (error) {
      console.error("❌ Email service error:", error);
      return false;
    }
  }

  /**
   * Send welcome email via server API
   */
  async sendWelcomeEmail(user: UserData, plan: PlanData): Promise<boolean> {
    try {
      const response = await fetch(`${emailConfig.apiUrl}/email/welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          plan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Failed to send welcome email:", result);
        return false;
      }

      console.log("✅ Welcome email sent:", result.emailId);
      return true;
    } catch (error) {
      console.error("❌ Email service error:", error);
      return false;
    }
  }

  /**
   * Send subscription activation notification via server API
   */
  async sendSubscriptionActivation(
    user: UserData,
    plan: PlanData,
    payment: PaymentData,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${emailConfig.apiUrl}/email/subscription-activation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user,
            plan,
            payment,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "❌ Failed to send subscription activation emails:",
          result,
        );
        return false;
      }

      console.log("✅ Subscription activation emails result:", result);
      return result.success || false;
    } catch (error) {
      console.error("❌ Failed to send subscription activation emails:", error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<boolean> {
    try {
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

      const emailData = {
        to: email,
        subject: "Reset Your Password - Tax Calculator",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below to create a new password:</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
          </div>
        `,
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("✅ Password reset email sent successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
