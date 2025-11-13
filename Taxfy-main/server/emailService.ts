import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableResendClient() {
  const { apiKey } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

export class EmailService {
  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(userEmail: string, userName?: string): Promise<void> {
    try {
      const { client, fromEmail } = await getUncachableResendClient();

      const displayName = userName || userEmail.split('@')[0];

      await client.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: 'Welcome to Taxfy - Your SARS Tax Calculator',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to Taxfy!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi ${displayName},
              </p>
              
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Thank you for signing up for Taxfy! We're excited to help you maximize your SARS tax refund.
              </p>
              
              <p style="margin: 0 0 30px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                With Taxfy, you can:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #1f2937; font-size: 16px; line-height: 1.8;">
                <li>Upload your IRP5 and extract data automatically with AI</li>
                <li>Calculate your SARS refund in minutes</li>
                <li>Download professional PDF reports</li>
                <li>Export data for easy SARS eFiling</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://${process.env.REPLIT_DEV_DOMAIN || 'taxfy.co.za'}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Calculate My Refund
                </a>
              </div>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Need help? Reply to this email or visit our help center.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} Taxfy. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                South African Tax Calculator | SARS Compliant
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

      console.log(`✅ Welcome email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw error;
    }
  }

  /**
   * Send calculation complete email with PDF report
   */
  static async sendCalculationCompleteEmail(
    userEmail: string,
    userName: string | undefined,
    refundAmount: number,
    taxYear: string,
    pdfBuffer?: Buffer,
  ): Promise<void> {
    try {
      const { client, fromEmail } = await getUncachableResendClient();

      const displayName = userName || userEmail.split('@')[0];
      const isRefund = refundAmount > 0;
      const formattedAmount = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(Math.abs(refundAmount));

      const emailData: any = {
        from: fromEmail,
        to: userEmail,
        subject: isRefund 
          ? `Your SARS Refund: ${formattedAmount} 🎉`
          : `Your SARS Tax Calculation Complete`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: ${isRefund ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ${isRefund ? 'Great News! 🎉' : 'Calculation Complete'}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi ${displayName},
              </p>
              
              <p style="margin: 0 0 30px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Your SARS tax calculation for ${taxYear} is complete!
              </p>
              
              <!-- Result Box -->
              <div style="background: ${isRefund ? '#ecfdf5' : '#eff6ff'}; border-left: 4px solid ${isRefund ? '#10b981' : '#3b82f6'}; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${isRefund ? 'Your Tax Refund' : 'Tax Amount Owing'}
                </p>
                <p style="margin: 0; color: ${isRefund ? '#059669' : '#2563eb'}; font-size: 36px; font-weight: 700;">
                  ${formattedAmount}
                </p>
              </div>
              
              ${isRefund ? `
              <p style="margin: 30px 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                You're getting money back from SARS! Here's what to do next:
              </p>
              
              <ol style="margin: 0 0 30px; padding-left: 20px; color: #1f2937; font-size: 16px; line-height: 1.8;">
                <li>Download your professional tax report (attached)</li>
                <li>Log into SARS eFiling at www.sarsefiling.co.za</li>
                <li>Complete your ITR12 return using the exported data</li>
                <li>Submit your return before the deadline</li>
                <li>Receive your refund in 5-10 business days</li>
              </ol>
              ` : `
              <p style="margin: 30px 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                You have tax owing to SARS. Here's what to do next:
              </p>
              
              <ol style="margin: 0 0 30px; padding-left: 20px; color: #1f2937; font-size: 16px; line-height: 1.8;">
                <li>Review your tax report (attached)</li>
                <li>Log into SARS eFiling at www.sarsefiling.co.za</li>
                <li>Complete your ITR12 return</li>
                <li>Arrange payment if required</li>
              </ol>
              `}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://${process.env.REPLIT_DEV_DOMAIN || 'taxfy.co.za'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  View Full Report
                </a>
              </div>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong>Important:</strong> SARS requires you to submit your return via their eFiling portal. We've prepared all the data you need - just follow the steps above!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} Taxfy. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                SARS-Compliant Tax Calculations
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      };

      // Add PDF attachment if provided
      if (pdfBuffer) {
        emailData.attachments = [
          {
            filename: `Taxfy_Tax_Report_${taxYear}.pdf`,
            content: pdfBuffer,
          },
        ];
      }

      await client.emails.send(emailData);

      console.log(`✅ Calculation complete email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send calculation email:', error);
      throw error;
    }
  }

  /**
   * Send refund reminder email (for tax season)
   */
  static async sendRefundReminderEmail(
    userEmail: string,
    userName: string | undefined,
  ): Promise<void> {
    try {
      const { client, fromEmail } = await getUncachableResendClient();

      const displayName = userName || userEmail.split('@')[0];
      const currentYear = new Date().getFullYear();

      await client.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: `SARS Tax Season Reminder - Don't Miss Your Refund!`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Tax Season is Here! ⏰</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi ${displayName},
              </p>
              
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                It's SARS tax filing season! Don't miss out on your potential refund.
              </p>
              
              <!-- Deadline Box -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Important Deadlines
                </p>
                <p style="margin: 0 0 5px; color: #92400e; font-size: 16px; line-height: 1.6;">
                  <strong>Non-provisional taxpayers:</strong> October 20, ${currentYear}
                </p>
                <p style="margin: 0; color: #92400e; font-size: 16px; line-height: 1.6;">
                  <strong>Provisional taxpayers:</strong> January 19, ${currentYear + 1}
                </p>
              </div>
              
              <p style="margin: 30px 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Calculate your refund in just 2 minutes with Taxfy:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #1f2937; font-size: 16px; line-height: 1.8;">
                <li>Upload your IRP5 certificate</li>
                <li>AI extracts your tax data automatically</li>
                <li>Get your refund amount instantly</li>
                <li>Download reports for SARS eFiling</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://${process.env.REPLIT_DEV_DOMAIN || 'taxfy.co.za'}/upload" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Calculate My Refund Now
                </a>
              </div>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Don't leave money on the table - the average South African gets R3,500+ back from SARS!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} Taxfy. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                SARS-Compliant Tax Calculator
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

      console.log(`✅ Refund reminder email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send reminder email:', error);
      throw error;
    }
  }

  /**
   * Generic email sender for custom emails
   */
  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { client, fromEmail } = await getUncachableResendClient();

      await client.emails.send({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      });

      console.log(`✅ Email sent to ${options.to}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }
}
