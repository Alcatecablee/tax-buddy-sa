#!/usr/bin/env node

/**
 * TAXFY CALCULATION AUDIT SCRIPT
 * 
 * This script runs comprehensive audits on all tax calculations
 * to ensure accuracy and compliance with SARS regulations.
 * 
 * Run with: npm run audit:calculations
 */

// Import using TypeScript file extension since we're in a TS project
import { calculateTax, calculateUIF, getTaxBracket } from '../lib/taxCalculator.ts';

// SARS-verified test cases for 2025/26 tax year
const TEST_CASES = [
  {
    name: "Low Income - No Tax Due",
    input: {
      grossIncome: 100000,
      retirementContrib: 10000,
      medicalContrib: 5000,
      medicalCredits: 4368,
      uifContrib: 1000,
      age: 35
    },
    expected: {
      taxableIncome: 89000,
      totalTax: 0, // Rebate exceeds tax
      marginalRate: 18
    }
  },
  {
    name: "Middle Income - Standard Case",
    input: {
      grossIncome: 480000,
      retirementContrib: 48000,
      medicalContrib: 24000,
      medicalCredits: 8736,
      uifContrib: 2125,
      age: 35
    },
    expected: {
      taxableIncome: 429875,
      marginalRate: 31,
      minTax: 50000,
      maxTax: 80000
    }
  },
  {
    name: "High Income - Multiple Brackets",
    input: {
      grossIncome: 1200000,
      retirementContrib: 330000, // 27.5%
      medicalContrib: 36000,
      medicalCredits: 8736,
      uifContrib: 2125,
      age: 35
    },
    expected: {
      taxableIncome: 867875,
      marginalRate: 41,
      minTax: 200000,
      maxTax: 300000
    }
  },
  {
    name: "Senior Citizen - Age Rebates",
    input: {
      grossIncome: 300000,
      retirementContrib: 30000,
      medicalContrib: 20000,
      medicalCredits: 4368,
      uifContrib: 2125,
      age: 65
    },
    expected: {
      primaryRebate: 26679, // Primary + Secondary
      marginalRate: 26
    }
  },
  {
    name: "Elderly - All Rebates",
    input: {
      grossIncome: 400000,
      retirementContrib: 40000,
      medicalContrib: 25000,
      medicalCredits: 4368,
      uifContrib: 2125,
      age: 75
    },
    expected: {
      primaryRebate: 29824, // All three rebates
      marginalRate: 26
    }
  },
  {
    name: "Your Actual IRP5",
    input: {
      grossIncome: 122664,
      retirementContrib: 31369,
      medicalContrib: 16728,
      medicalCredits: 2912,
      uifContrib: 1460,
      age: 35
    },
    expected: {
      taxableIncome: 89835,
      totalTax: 0, // Should be zero after rebates
      marginalRate: 18
    }
  }
];

// Edge cases that should be handled gracefully
const EDGE_CASES = [
  {
    name: "Zero Income",
    input: { grossIncome: 0, retirementContrib: 0, medicalContrib: 0, medicalCredits: 0 },
    expected: { taxableIncome: 0, totalTax: 0, effectiveRate: 0 }
  },
  {
    name: "Negative Income (Invalid)",
    input: { grossIncome: -50000, retirementContrib: 0, medicalContrib: 0, medicalCredits: 0 },
    expected: { taxableIncome: 0, totalTax: 0 } // Should handle gracefully
  },
  {
    name: "Excessive Retirement Contribution",
    input: { grossIncome: 100000, retirementContrib: 200000, medicalContrib: 0, medicalCredits: 0 },
    expected: { taxableIncome: 72500 } // Should cap at 27.5%
  },
  {
    name: "Very High Income",
    input: { grossIncome: 10000000, retirementContrib: 350000, medicalContrib: 100000, medicalCredits: 20000 },
    expected: { marginalRate: 45, totalTax: { min: 3000000 } } // Top bracket
  }
];

// Audit results
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

console.log('🔍 TAXFY CALCULATION AUDIT STARTING...');
console.log('=====================================\n');

// Run main test cases
console.log('📊 RUNNING MAIN TEST CASES:');
console.log('---------------------------');

for (const testCase of TEST_CASES) {
  totalTests++;
  console.log(`\n🧪 Testing: ${testCase.name}`);
  
  try {
    const result = calculateTax(testCase.input);
    let passed = true;
    let errors = [];
    
    // Validate expected results
    if (testCase.expected.taxableIncome !== undefined) {
      if (result.taxableIncome !== testCase.expected.taxableIncome) {
        passed = false;
        errors.push(`Taxable Income: Expected ${testCase.expected.taxableIncome}, got ${result.taxableIncome}`);
      }
    }
    
    if (testCase.expected.totalTax !== undefined) {
      if (result.totalTax !== testCase.expected.totalTax) {
        passed = false;
        errors.push(`Total Tax: Expected ${testCase.expected.totalTax}, got ${result.totalTax}`);
      }
    }
    
    if (testCase.expected.marginalRate !== undefined) {
      if (result.marginalRate !== testCase.expected.marginalRate) {
        passed = false;
        errors.push(`Marginal Rate: Expected ${testCase.expected.marginalRate}%, got ${result.marginalRate}%`);
      }
    }
    
    if (testCase.expected.primaryRebate !== undefined) {
      if (result.primaryRebate !== testCase.expected.primaryRebate) {
        passed = false;
        errors.push(`Primary Rebate: Expected ${testCase.expected.primaryRebate}, got ${result.primaryRebate}`);
      }
    }
    
    // Range checks for complex calculations
    if (testCase.expected.minTax && testCase.expected.maxTax) {
      if (result.totalTax < testCase.expected.minTax || result.totalTax > testCase.expected.maxTax) {
        passed = false;
        errors.push(`Total Tax Range: Expected ${testCase.expected.minTax}-${testCase.expected.maxTax}, got ${result.totalTax}`);
      }
    }
    
    if (passed) {
      console.log(`   ✅ PASSED`);
      console.log(`   📈 Taxable Income: R${result.taxableIncome.toLocaleString()}`);
      console.log(`   💰 Total Tax: R${result.totalTax.toLocaleString()}`);
      console.log(`   📊 Effective Rate: ${result.effectiveRate}%`);
      passedTests++;
    } else {
      console.log(`   ❌ FAILED`);
      errors.forEach(error => console.log(`   🔸 ${error}`));
      failedTests.push({ name: testCase.name, errors });
    }
    
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
    failedTests.push({ name: testCase.name, errors: [error.message] });
  }
}

// Run edge cases
console.log('\n\n🚨 RUNNING EDGE CASE TESTS:');
console.log('---------------------------');

for (const edgeCase of EDGE_CASES) {
  totalTests++;
  console.log(`\n🧪 Testing: ${edgeCase.name}`);
  
  try {
    const result = calculateTax(edgeCase.input);
    let passed = true;
    let errors = [];
    
    // Validate edge case expectations
    Object.keys(edgeCase.expected).forEach(key => {
      if (key === 'totalTax' && typeof edgeCase.expected[key] === 'object') {
        // Range check
        if (edgeCase.expected[key].min && result[key] < edgeCase.expected[key].min) {
          passed = false;
          errors.push(`${key}: Expected min ${edgeCase.expected[key].min}, got ${result[key]}`);
        }
      } else if (result[key] !== edgeCase.expected[key]) {
        passed = false;
        errors.push(`${key}: Expected ${edgeCase.expected[key]}, got ${result[key]}`);
      }
    });
    
    // Ensure no negative values
    if (result.taxableIncome < 0 || result.totalTax < 0) {
      passed = false;
      errors.push('Negative values detected - should be handled gracefully');
    }
    
    if (passed) {
      console.log(`   ✅ PASSED - Handled gracefully`);
      passedTests++;
    } else {
      console.log(`   ❌ FAILED`);
      errors.forEach(error => console.log(`   🔸 ${error}`));
      failedTests.push({ name: edgeCase.name, errors });
    }
    
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
    failedTests.push({ name: edgeCase.name, errors: [error.message] });
  }
}

// UIF Calculation Tests
console.log('\n\n💼 TESTING UIF CALCULATIONS:');
console.log('----------------------------');

const uifTests = [
  { income: 120000, expected: 1200 }, // 1% of gross
  { income: 240000, expected: 2125 }, // Capped at max
  { income: 5000000, expected: 2125 }, // Still capped
  { income: 0, expected: 0 } // Zero income
];

uifTests.forEach(test => {
  totalTests++;
  const result = calculateUIF(test.income);
  if (result === test.expected) {
    console.log(`✅ UIF for R${test.income.toLocaleString()}: R${result.toLocaleString()}`);
    passedTests++;
  } else {
    console.log(`❌ UIF for R${test.income.toLocaleString()}: Expected R${test.expected.toLocaleString()}, got R${result.toLocaleString()}`);
    failedTests.push({ name: `UIF Calculation - R${test.income.toLocaleString()}`, errors: [`Expected ${test.expected}, got ${result}`] });
  }
});

// Final Results
console.log('\n\n🏁 AUDIT RESULTS:');
console.log('=================');
console.log(`📊 Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests.length}`);
console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests.length > 0) {
  console.log('\n🚨 FAILED TESTS SUMMARY:');
  console.log('------------------------');
  failedTests.forEach(failure => {
    console.log(`\n❌ ${failure.name}:`);
    failure.errors.forEach(error => console.log(`   🔸 ${error}`));
  });
  
  console.log('\n⚠️  AUDIT FAILED - Please review and fix the issues above');
  process.exit(1);
} else {
  console.log('\n🎉 ALL TESTS PASSED! Your tax calculations are accurate and SARS-compliant.');
  console.log('✨ Taxfy is ready for production use.');
}

console.log('\n📝 Audit completed at:', new Date().toISOString());
console.log('🔗 For SARS tax tables: https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/'); 