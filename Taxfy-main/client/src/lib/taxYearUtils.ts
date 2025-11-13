// South African Tax Year Utility Functions
// Handles SA tax year conventions where tax year runs March 1 to February 28/29

export function getCurrentTaxYear(): string {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based (0 = January, 1 = February, 2 = March)
  
  // If we're in January or February, we're still in the previous tax year
  if (currentMonth < 2) { // January (0) or February (1)
    return currentYear.toString();
  } else {
    // March onwards means we're in the next tax year
    return (currentYear + 1).toString();
  }
}

export function formatTaxYear(taxYear: string): string {
  const year = parseInt(taxYear);
  return `${year - 1}/${year.toString().slice(-2)}`;
}

export function formatTaxYearFull(taxYear: string): string {
  const year = parseInt(taxYear);
  const startYear = year - 1;
  return `${taxYear} Tax Year (${startYear} Mar - ${year} Feb)`;
}

export interface TaxYearInfo {
  taxYear: string;
  period: {
    start: string;
    end: string;
  };
  filingStatus: 'not-open' | 'open' | 'closed';
  deadlines: {
    nonProvisional?: string;
    provisional?: string;
  };
}

export function getTaxYearInfo(taxYear: string): TaxYearInfo {
  const year = parseInt(taxYear);
  const startYear = year - 1;
  
  const currentTaxYear = getCurrentTaxYear();
  const currentYear = parseInt(currentTaxYear);
  
  let filingStatus: 'not-open' | 'open' | 'closed';
  let deadlines: { nonProvisional?: string; provisional?: string } = {};
  
  if (year > currentYear) {
    filingStatus = 'not-open';
  } else if (year === currentYear - 1) {
    filingStatus = 'open';
    deadlines = {
      nonProvisional: `October ${year}`,
      provisional: `January ${year + 1}`
    };
  } else {
    filingStatus = 'closed';
  }
  
  return {
    taxYear,
    period: {
      start: `1 March ${startYear}`,
      end: `28 February ${year}`
    },
    filingStatus,
    deadlines
  };
}

export function getSampleTaxYears(): string[] {
  const currentTaxYear = parseInt(getCurrentTaxYear());
  return [
    currentTaxYear.toString(),
    (currentTaxYear - 1).toString(),
    (currentTaxYear - 2).toString(),
    (currentTaxYear - 3).toString()
  ];
}

export function isValidTaxYear(taxYear: string): boolean {
  const year = parseInt(taxYear);
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && year >= 2020 && year <= currentYear + 1;
}

export function getTaxYearFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  
  // If date is in January or February, it belongs to the tax year ending in that year
  if (month < 2) {
    return year.toString();
  } else {
    // March onwards belongs to the tax year ending in the following year
    return (year + 1).toString();
  }
} 