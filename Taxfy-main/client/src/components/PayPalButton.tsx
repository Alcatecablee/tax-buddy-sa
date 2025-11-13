import React, { useEffect, useRef } from 'react';
import { loadScript } from '@paypal/paypal-js';

interface PayPalButtonProps {
  amount: string;
  currency?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  onCancel
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPayPal = async () => {
      try {
        // Get PayPal client ID from environment variables
        const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AW9bPnm8AXQfbCP4IdkmzIgRPwlqZ_4fXx56r2cpr_-HJTAKQpWVkSj0g2SHSm9XAUSus3Sv6e21Crdh';
        
        const paypal = await loadScript({
          clientId: clientId,
          currency: currency,
          // Disable popup and force redirect
          disableFunding: 'credit,card',
          enableFunding: 'venmo'
        });

        if (paypal && paypal.Buttons && paypalRef.current) {
          // Clear any existing buttons
          paypalRef.current.innerHTML = '';

          paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal'
            },
            // Force redirect instead of popup
            fundingSource: paypal.FUNDING.PAYPAL,
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: amount,
                    currency_code: currency
                  }
                }],
                application_context: {
                  // Force redirect instead of popup
                  user_action: 'PAY_NOW',
                  payment_method: {
                    payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                  }
                }
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const details = await actions.order.capture();
                console.log('Payment successful:', details);
                if (onSuccess) {
                  onSuccess(details);
                }
              } catch (error) {
                console.error('Payment capture error:', error);
                if (onError) {
                  onError(error);
                }
              }
            },
            onError: (error: any) => {
              console.error('PayPal error:', error);
              if (onError) {
                onError(error);
              }
            },
            onCancel: () => {
              console.log('Payment cancelled');
              if (onCancel) {
                onCancel();
              }
            }
          }).render(paypalRef.current);
        }
      } catch (error) {
        console.error('Failed to load PayPal:', error);
        if (onError) {
          onError(error);
        }
      }
    };

    initPayPal();
  }, [amount, currency, onSuccess, onError, onCancel]);

  return (
    <div className="paypal-button-container">
      <div ref={paypalRef} />
    </div>
  );
};

export default PayPalButton; 