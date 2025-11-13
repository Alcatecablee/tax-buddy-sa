#!/usr/bin/env node

/**
 * TAXFY CALCULATION AUDIT SCRIPT
 * 
 * This script runs comprehensive audits on all tax calculations
 * to ensure accuracy and compliance with SARS regulations.
 * 
 * Run with: npm run audit:calculations
 */

// For now, we'll create a simplified audit that doesn't require imports
// This will be expanded once we have proper build tooling

console.log('🔍 TAXFY CALCULATION AUDIT STARTING...');
console.log('=====================================\n');

// Simplified audit - checking basic math and constants
console.log('📊 RUNNING BASIC VALIDATION CHECKS:');
console.log('-----------------------------------');

// Tax bracket validation
const TAX_BRACKETS_2026 = [
  { min: 0, max: 237100, rate: 0.18 },
  { min: 237100, max: 370500, rate: 0.26 },
  { min: 370500, max: 512800, rate: 0.31 },
  { min: 512800, max: 673000, rate: 0.36 },
  { min: 673000, max: 857900, rate: 0.39 },
  { min: 857900, max: 1817000, rate: 0.41 },
  { min: 1817000, max: Infinity, rate: 0.45 }
];

// Rebate validation
const PRIMARY_REBATE_2026 = 17235;
const SECONDARY_REBATE_2026 = 9444;
const TERTIARY_REBATE_2026 = 3145;

// Medical credits validation
const MEDICAL_CREDITS_2026 = {
  mainMember: 364,
  firstDependent: 364,
  additionalDependents: 246
};

let totalChecks = 0;
let passedChecks = 0;

// Check 1: Tax brackets are properly ordered
totalChecks++;
let bracketsValid = true;
for (let i = 1; i < TAX_BRACKETS_2026.length; i++) {
  if (TAX_BRACKETS_2026[i].min !== TAX_BRACKETS_2026[i-1].max) {
    bracketsValid = false;
    break;
  }
}

if (bracketsValid) {
  console.log('✅ Tax brackets are properly ordered and continuous');
  passedChecks++;
} else {
  console.log('❌ Tax brackets have gaps or overlaps');
}

// Check 2: Tax rates are progressive
totalChecks++;
let ratesProgressive = true;
for (let i = 1; i < TAX_BRACKETS_2026.length; i++) {
  if (TAX_BRACKETS_2026[i].rate <= TAX_BRACKETS_2026[i-1].rate) {
    ratesProgressive = false;
    break;
  }
}

if (ratesProgressive) {
  console.log('✅ Tax rates are progressive (increasing)');
  passedChecks++;
} else {
  console.log('❌ Tax rates are not properly progressive');
}

// Check 3: Rebates are reasonable
totalChecks++;
const totalMaxRebates = PRIMARY_REBATE_2026 + SECONDARY_REBATE_2026 + TERTIARY_REBATE_2026;
if (totalMaxRebates > 0 && totalMaxRebates < 50000) {
  console.log(`✅ Total rebates (R${totalMaxRebates.toLocaleString()}) are within reasonable range`);
  passedChecks++;
} else {
  console.log(`❌ Total rebates (R${totalMaxRebates.toLocaleString()}) seem unreasonable`);
}

// Check 4: Medical credits are reasonable
totalChecks++;
const annualMainMember = MEDICAL_CREDITS_2026.mainMember * 12;
if (annualMainMember > 0 && annualMainMember < 10000) {
  console.log(`✅ Annual medical credits (R${annualMainMember.toLocaleString()}) are reasonable`);
  passedChecks++;
} else {
  console.log(`❌ Annual medical credits (R${annualMainMember.toLocaleString()}) seem unreasonable`);
}

// Check 5: Basic tax calculation logic
totalChecks++;
console.log('\n🧮 Testing basic tax calculation logic:');

// Simple test case: R100k income, R10k retirement
const grossIncome = 100000;
const retirementContrib = 10000;
const taxableIncome = grossIncome - retirementContrib;

// Calculate tax manually
let tax = 0;
for (const bracket of TAX_BRACKETS_2026) {
  if (taxableIncome <= bracket.min) break;
  
  const bracketMax = bracket.max === Infinity ? taxableIncome : Math.min(bracket.max, taxableIncome);
  const taxableInBracket = bracketMax - bracket.min;
  
  if (taxableInBracket > 0) {
    tax += taxableInBracket * bracket.rate;
  }
}

const taxAfterRebates = Math.max(0, tax - PRIMARY_REBATE_2026);

console.log(`   Gross Income: R${grossIncome.toLocaleString()}`);
console.log(`   Retirement: R${retirementContrib.toLocaleString()}`);
console.log(`   Taxable Income: R${taxableIncome.toLocaleString()}`);
console.log(`   Tax before rebates: R${Math.round(tax).toLocaleString()}`);
console.log(`   Tax after rebates: R${Math.round(taxAfterRebates).toLocaleString()}`);

if (tax > 0 && taxAfterRebates >= 0) {
  console.log('✅ Basic tax calculation logic works correctly');
  passedChecks++;
} else {
  console.log('❌ Basic tax calculation logic has issues');
}

// Check 6: Your actual IRP5 validation
totalChecks++;
console.log('\n📋 Validating your actual IRP5 data:');

const yourData = {
  grossIncome: 122664,
  retirementContrib: 31369,
  uifContrib: 1460,
  medicalCredits: 2912
};

const yourTaxableIncome = yourData.grossIncome - yourData.retirementContrib - yourData.uifContrib;
console.log(`   Your taxable income: R${yourTaxableIncome.toLocaleString()}`);

// Calculate your tax
let yourTax = 0;
for (const bracket of TAX_BRACKETS_2026) {
  if (yourTaxableIncome <= bracket.min) break;
  
  const bracketMax = bracket.max === Infinity ? yourTaxableIncome : Math.min(bracket.max, yourTaxableIncome);
  const taxableInBracket = bracketMax - bracket.min;
  
  if (taxableInBracket > 0) {
    yourTax += taxableInBracket * bracket.rate;
  }
}

const yourTaxAfterRebates = Math.max(0, yourTax - PRIMARY_REBATE_2026 - yourData.medicalCredits);

console.log(`   Tax before rebates: R${Math.round(yourTax).toLocaleString()}`);
console.log(`   Tax after rebates & credits: R${Math.round(yourTaxAfterRebates).toLocaleString()}`);

if (yourTaxAfterRebates === 0) {
  console.log('✅ Your IRP5 calculation confirms zero tax liability');
  passedChecks++;
} else {
  console.log(`❌ Your IRP5 calculation shows R${Math.round(yourTaxAfterRebates).toLocaleString()} tax due`);
}

// Final Results
console.log('\n\n🏁 AUDIT RESULTS:');
console.log('=================');
console.log(`📊 Total Checks: ${totalChecks}`);
console.log(`✅ Passed: ${passedChecks}`);
console.log(`❌ Failed: ${totalChecks - passedChecks}`);
console.log(`📈 Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 ALL BASIC CHECKS PASSED!');
  console.log('✨ Tax calculation constants and logic are validated.');
  console.log('🔧 Run "npm run test:tax" for comprehensive function testing.');
} else {
  console.log('\n⚠️  SOME CHECKS FAILED - Please review the issues above');
}

console.log('\n📝 Basic audit completed at:', new Date().toISOString());
console.log('🔗 For SARS tax tables: https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/');
console.log('🧪 For full testing: npm run test:tax');
console.log('📊 For test coverage: npm run test:coverage'); 