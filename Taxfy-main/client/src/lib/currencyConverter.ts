// Currency conversion utilities for Taxfy
// Handles display of ZAR prices while PayPal processes in USD

export interface ExchangeRates {
  ZAR: number;
  USD: number;
  EUR: number;
  GBP: number;
}

// Current exchange rates (should be updated regularly or fetched from API)
export const EXCHANGE_RATES: ExchangeRates = {
  ZAR: 1.0, // Base currency
  USD: 18.18, // 1 USD = ~18.18 ZAR
  EUR: 20.0, // 1 EUR = ~20.0 ZAR
  GBP: 23.0, // 1 GBP = ~23.0 ZAR
};

// PayPal conversion rates (for PayPal API)
export const PAYPAL_RATES: ExchangeRates = {
  ZAR: 0.055, // 1 ZAR = ~0.055 USD
  USD: 1.0,
  EUR: 1.1,
  GBP: 1.27,
};

/**
 * Convert ZAR to USD for PayPal processing
 * @param zarAmount Amount in ZAR
 * @returns Amount in USD for PayPal
 */
export function convertZarToUsdForPaypal(zarAmount: number): number {
  return zarAmount * PAYPAL_RATES.ZAR;
}

/**
 * Convert any currency to USD for PayPal
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @returns Amount in USD
 */
export function convertToUsdForPaypal(
  amount: number,
  fromCurrency: string,
): number {
  const rate =
    PAYPAL_RATES[fromCurrency as keyof ExchangeRates] || PAYPAL_RATES.ZAR;
  return amount * rate;
}

/**
 * Format currency for display (always shows ZAR for South African users)
 * @param amount Amount to format
 * @param currency Currency code (defaults to ZAR)
 * @returns Formatted currency string
 */
export function formatDisplayCurrency(
  amount: number,
  currency: string = "ZAR",
): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Show USD equivalent for reference (helpful for users to understand PayPal charges)
 * @param zarAmount Amount in ZAR
 * @returns Formatted string showing both ZAR and USD
 */
export function formatWithUsdEquivalent(zarAmount: number): string {
  const usdAmount = convertZarToUsdForPaypal(zarAmount);
  return `${formatDisplayCurrency(zarAmount, "ZAR")} (~$${usdAmount.toFixed(2)} USD)`;
}

/**
 * Get current exchange rate info for display
 */
export function getExchangeRateInfo(): string {
  return `Exchange rate: 1 ZAR = $${PAYPAL_RATES.ZAR.toFixed(3)} USD (PayPal rate)`;
}
