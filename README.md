# @sifxt/money-utils

A comprehensive TypeScript money utilities library with currency-aware operations, precise decimal arithmetic, and financial calculation helpers.

[![npm version](https://img.shields.io/npm/v/@sifxt/money-utils.svg)](https://www.npmjs.com/package/@sifxt/money-utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @sifxt/money-utils
```

```bash
yarn add @sifxt/money-utils
```

```bash
pnpm add @sifxt/money-utils
```

> **Note:** This package depends on `@sifxt/math-utils` for precise decimal arithmetic.

## Quick Start

```typescript
import * as Money from '@sifxt/money-utils';

// Basic arithmetic (string-based for precision)
Money.add('100.50', '200.75');      // '301.25'
Money.subtract('500', '123.45');    // '376.55'
Money.multiply('0.1', '0.2');       // '0.02' (no floating-point error!)

// Currency-aware rounding
Money.round('123.456', 2);                      // '123.46'
Money.roundForCurrency('99.999', 'INR');        // '100'
Money.roundForCurrency('99.999', 'JPY');        // '100' (0 decimals)
Money.roundForCurrency('99.9999', 'KWD');       // '100' (3 decimals)

// GST calculations (Indian tax)
const gst = Money.calculateGST('1000', '18');
// { gstAmount: '180', cgst: '90', sgst: '90', totalWithGST: '1180' }

// Invoice line item
const item = Money.calculateLineItem({
  unitPrice: '100',
  quantity: 2,
  taxRate: '18',
  discountAmount: '10'
});
// { calculated: { grossAmount: '200', taxableAmount: '190', taxAmount: '34.2', total: '224.2' } }
```

## Features

✅ **Zero Floating-Point Errors** - BigInt-based arithmetic via @sifxt/math-utils  
✅ **50+ Currencies** - Full ISO 4217 support with proper decimal places  
✅ **9 Rounding Modes** - Including Banker's rounding (ROUND_HALF_EVEN)  
✅ **GST/Tax Calculations** - CGST/SGST split, reverse calculations  
✅ **Invoice Support** - Line item calculations with audit trails  
✅ **Rounding Adjustment Tracking** - For financial reconciliation  
✅ **Type Safe** - Full TypeScript support with proper types  
✅ **Enterprise Ready** - Comprehensive test coverage and documentation  

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
- [API Reference](#api-reference)
  - [Basic Arithmetic](#basic-arithmetic)
  - [Comparison Operations](#comparison-operations)
  - [Validation & Utility Functions](#validation--utility-functions)
  - [Rounding Operations](#rounding-operations)
  - [Percentage Calculations](#percentage-calculations)
  - [Money Object Operations](#money-object-operations)
  - [Currency Money Operations](#currency-money-operations)
  - [Numeric Money Operations](#numeric-money-operations)
  - [Currency Operations](#currency-operations)
  - [Tax Calculations](#tax-calculations)
  - [Invoice Line Items](#invoice-line-items)
  - [Allocation & Distribution](#allocation--distribution)
  - [Financial Helpers](#financial-helpers)
  - [Ledger & Adjustment Functions](#ledger--adjustment-functions)
  - [Precise Functions (Re-exports)](#precise-functions-re-exports)
  - [Constants & Configuration](#constants--configuration)
  - [Types & Interfaces](#types--interfaces)
- [Rounding Modes](#rounding-modes)
- [Supported Currencies](#supported-currencies)
- [Architecture](#architecture)
- [Best Practices](#best-practices)

## API Reference

### Basic Arithmetic

All arithmetic operations accept `number | string` and return precise string results.

```typescript
import { add, subtract, multiply, divide, sum, average } from '@sifxt/money-utils';

// Addition
add('100.50', '200.75');        // '301.25'
add(100.5, 200.75);             // '301.25'
add('0.1', '0.2');              // '0.3' (not 0.30000000000000004!)

// Subtraction
subtract('500', '123.45');      // '376.55'
subtract('0.3', '0.1');         // '0.2'

// Multiplication
multiply('12.50', '3');         // '37.5'
multiply('0.1', '0.2');         // '0.02'

// Division (with optional precision)
divide('100', '3');             // '33.33333333333333333333' (20 decimal places)
divide('100', '3', 2);          // '33.33'
divide('10', '4', 2);           // '2.5'

// Aggregates
sum('100', '50', '75', '25');   // '250'
average('100', '50', '75', '25'); // '62.5'
min('100', '50', '75', '25');   // '25'
max('100', '50', '75', '25');   // '100'

// Absolute value and negation
abs('-123.45');                 // '123.45'
negate('100');                  // '-100'
negate('-50');                  // '50'
```

### Comparison Operations

```typescript
import { 
  compare, equals, greaterThan, greaterThanOrEqual,
  lessThan, lessThanOrEqual, isZero, isPositive, isNegative,
  inRange, clamp
} from '@sifxt/money-utils';

compare('100', '50');           // 1 (first is greater)
compare('50', '100');           // -1 (first is smaller)
compare('100', '100');          // 0 (equal)

equals('100', '100');           // true
equals('100.00', '100');        // true
equals('100', '100.01');        // false

greaterThan('150', '100');      // true
greaterThanOrEqual('100', '100'); // true
lessThan('50', '100');          // true
lessThanOrEqual('100', '100');  // true

// Zero and sign checks
isZero('0');                    // true
isZero('0.00');                 // true
isPositive('100');              // true
isNegative('-50');              // true

// Range operations
inRange('50', '0', '100');      // true (50 is between 0 and 100)
inRange('150', '0', '100');     // false
clamp('150', '0', '100');       // '100' (clamps to max)
clamp('-50', '0', '100');       // '0' (clamps to min)
clamp('50', '0', '100');        // '50' (within range)
```

### Validation & Utility Functions

```typescript
import { 
  isValidNumber, isPositiveNumber, isNegativeNumber, isIntegerAmount,
  absoluteValue, signOf, compareNumbers, minNumber, maxNumber,
  roundNumber, ceilNumber
} from '@sifxt/money-utils';

// Validation (returns boolean)
isValidNumber(123);             // true
isValidNumber('123.45');        // true
isValidNumber('abc');           // false
isValidNumber(NaN);             // false
isValidNumber(Infinity);        // false

isPositiveNumber(100);          // true
isPositiveNumber(-50);          // false
isNegativeNumber(-50);          // true
isIntegerAmount(100);           // true
isIntegerAmount(100.5);         // false

// Utility functions (return number)
absoluteValue(-123.45);         // 123.45
signOf(100);                    // 1
signOf(-50);                    // -1
signOf(0);                      // 0

compareNumbers('100', '50');    // 1
minNumber(100, 50, 75);         // 50
maxNumber(100, 50, 75);         // 100

roundNumber(123.456, 2);        // 123.46
ceilNumber(123.001, 2);         // 123.01
```

### Rounding Operations

```typescript
import { round, roundForCurrency, roundWithAdjustment, RoundingMode } from '@sifxt/money-utils';

// Default rounding (Banker's rounding - ROUND_HALF_EVEN)
round('123.455', 2);            // '123.46'
round('123.445', 2);            // '123.44'
round('2.5', 0);                // '2' (rounds to even)
round('3.5', 0);                // '4' (rounds to even)

// Different rounding modes
round('2.5', 0, RoundingMode.ROUND_HALF_UP);   // '3'
round('2.5', 0, RoundingMode.ROUND_HALF_DOWN); // '2'
round('2.3', 0, RoundingMode.ROUND_CEIL);      // '3'
round('2.7', 0, RoundingMode.ROUND_FLOOR);     // '2'
round('2.1', 0, RoundingMode.ROUND_UP);        // '3'
round('2.9', 0, RoundingMode.ROUND_DOWN);      // '2'

// Currency-aware rounding
roundForCurrency('99.999', 'INR');  // '100' (2 decimals)
roundForCurrency('99.999', 'JPY');  // '100' (0 decimals)
roundForCurrency('99.9999', 'KWD'); // '100' (3 decimals)

// Rounding with adjustment tracking (for auditing)
roundWithAdjustment('123.456', 2);
// {
//   original: '123.456',
//   rounded: '123.46',
//   adjustment: '0.004',
//   decimalPlaces: 2,
//   roundingMode: 'ROUND_HALF_EVEN',
//   hasAdjustment: true
// }

// Currency-aware rounding with adjustment
roundForCurrencyWithAdjustment('99.999', 'INR');
// Returns RoundingAdjustment with currency-specific decimal places
```

### Percentage Calculations

```typescript
import { percentage, addPercentage, subtractPercentage, percentOfNumber } from '@sifxt/money-utils';

// Calculate percentage (returns number for currency precision)
percentage(1000, 18);           // 180 (18% of 1000)
percentage('250', '15');        // 37.5 (15% of 250)

// Add percentage
addPercentage(1000, 18);        // 1180 (add 18%)
addPercentage('100', '10');     // 110

// Subtract percentage
subtractPercentage(1000, 10);   // 900 (subtract 10%)
subtractPercentage('200', '25'); // 150

// What percentage is X of Y?
percentOfNumber(250, 1000);     // 25 (250 is 25% of 1000)
percentOfNumber('50', '200');   // 25

// Precise percentage (string-based)
percentageOf('250', '1000');    // '25' (string result)
```

### Money Object Operations

```typescript
import { createMoney, addMoney, subtractMoney, multiplyMoney, roundMoney } from '@sifxt/money-utils';

// Create Money objects
const amount1 = createMoney('1000', 'INR');
// { amount: '1000', currency: 'INR' }

// Add Money objects (same currency only)
const amount2 = createMoney('500', 'INR');
const total = addMoney(amount1, amount2);
// { amount: '1500', currency: 'INR' }

// Subtract Money
subtractMoney(amount1, amount2);
// { amount: '500', currency: 'INR' }

// Multiply Money by factor
multiplyMoney(amount1, 2.5);
// { amount: '2500', currency: 'INR' }

// Round Money
roundMoney(createMoney('1234.567', 'INR'), 2);
// { amount: '1234.57', currency: 'INR' }

// Divide Money
divideMoney(createMoney('1000', 'INR'), 4);
// { amount: '250', currency: 'INR' }

// Currency mismatch throws error
const usd = createMoney('100', 'USD');
addMoney(amount1, usd); // Error: Cannot add different currencies
```

### Currency Money Operations

```typescript
import { 
  createCurrencyMoney, addCurrencyMoney, 
  roundMoneyToCurrency, roundMoneyWithAdjustment 
} from '@sifxt/money-utils';

// Create CurrencyMoney (includes decimal places)
const currencyMoney = createCurrencyMoney('1234.567', 'INR');
// { amount: '1234.57', currency: 'INR', decimalPlaces: 2 }

// Add CurrencyMoney objects
const sum = addCurrencyMoney(currencyMoney, createCurrencyMoney('500', 'INR'));
// { amount: '1734.57', currency: 'INR', decimalPlaces: 2 }

// Round money to currency-specific decimals
roundMoneyToCurrency(createMoney('123.456', 'INR'));
// { amount: '123.46', currency: 'INR' }

// Round with adjustment tracking
roundMoneyWithAdjustment(createMoney('123.456', 'INR'), 2);
// Returns Money object with RoundingAdjustment
```

### Numeric Money Operations

```typescript
import { 
  addMoneyNumbers, subtractMoneyNumbers, multiplyMoneyNumbers,
  divideMoneyNumbers, roundCurrencyNumber, percentageNumber,
  subtractMoneyList
} from '@sifxt/money-utils';

// These return numbers (not strings) for currency-aware calculations
addMoneyNumbers(100.5, 200.75, 'INR');      // 301.25
subtractMoneyNumbers(500, 123.45, 'INR');   // 376.55
multiplyMoneyNumbers(100, 2.5, 'INR');      // 250
divideMoneyNumbers(1000, 3, 'INR');         // 333.33

// Round to currency decimals (returns number)
roundCurrencyNumber(123.456, 'INR');        // 123.46
roundCurrencyNumber(123.456, 'JPY');        // 123

// Calculate percentage (returns number)
percentageNumber(1000, 18, 'INR');          // 180

// Subtract list from initial value
subtractMoneyList('1000', ['100', '200', '50'], 'INR');  // '650'
```

### Currency Operations

```typescript
import { 
  getCurrencyConfig, 
  getCurrencyDecimalPlaces, 
  getCurrencySymbol,
  isValidCurrency,
  formatMoney,
  parseMoney,
  parseAndRoundCurrencyInput,
  isValidCurrencyInput,
  CURRENCY_INPUT_PATTERN,
  toSmallestUnit,
  fromSmallestUnit
} from '@sifxt/money-utils';

// Get full currency configuration
getCurrencyConfig('INR');
// {
//   code: 'INR',
//   symbol: '₹',
//   decimalPlaces: 2,
//   locale: 'en-IN',
//   smallestUnit: 'paise',
//   name: 'INR',
//   roundingMode: 'ROUND_HALF_EVEN'
// }

// Get specific properties
getCurrencyDecimalPlaces('JPY');  // 0
getCurrencyDecimalPlaces('KWD');  // 3
getCurrencySymbol('EUR');         // '€'
isValidCurrency('INR');           // true
isValidCurrency('XYZ');           // false

// Format for display
formatMoney(1234567.89, 'INR', 'en-IN'); // '₹12,34,567.89'
formatMoney(1234.56, 'USD', 'en-US');    // '$1,234.56'

// Parse formatted money
parseMoney('₹1,234.56');          // '1234.56'
parseMoney('$1,000.00');          // '1000.00'

// Parse and round user-entered currency input
parseAndRoundCurrencyInput('123.456', 'INR');  // 123.46 (rounded to 2 decimals)
parseAndRoundCurrencyInput('99.999', 'JPY');   // 100 (rounded to 0 decimals)
parseAndRoundCurrencyInput('', 'INR');          // 0 (empty string)
parseAndRoundCurrencyInput('.', 'INR');         // 0 (just decimal point)

// Validate currency input while user types
isValidCurrencyInput('123');        // true
isValidCurrencyInput('123.45');     // true
isValidCurrencyInput('123.45.67'); // false (multiple decimal points)
isValidCurrencyInput('abc');        // false (non-numeric)
isValidCurrencyInput('12.3.4');    // false

// Currency input pattern (regex)
CURRENCY_INPUT_PATTERN.test('123.45');  // true
CURRENCY_INPUT_PATTERN.test('abc');     // false

// Convert to/from smallest units (e.g., paise/cents)
toSmallestUnit('123.45', 2);      // '12345' (rupees to paise)
fromSmallestUnit('12345', 2);     // '123.45' (paise to rupees)
```

### Tax Calculations

```typescript
import { calculateTax, calculateGST, calculateBaseFromTaxInclusive, splitTaxCGSTSGST } from '@sifxt/money-utils';

// Basic tax calculation
calculateTax('1000', '18', 'INR');
// {
//   taxAmount: '180',
//   totalWithTax: '1180'
// }

// GST with CGST/SGST split (Indian GST)
calculateGST('1000', '18', 'INR');
// {
//   gstAmount: '180',
//   cgst: '90',
//   sgst: '90',
//   totalWithGST: '1180'
// }

// Reverse calculation from tax-inclusive price
calculateBaseFromTaxInclusive('1180', '18', 'INR');
// {
//   baseAmount: '1000',
//   taxAmount: '180'
// }

// Split tax into CGST/SGST
splitTaxCGSTSGST('180', 'INR');
// { cgst: '90', sgst: '90' }

// Handle odd amounts
splitTaxCGSTSGST('181', 'INR');
// { cgst: '90.5', sgst: '90.5' }
```

### Invoice Line Items

```typescript
import { 
  calculateLineItem, 
  calculateLineItemFromTotal, 
  aggregateLineItems,
  verifyInvoiceIntegrity,
  validateLineItemInput
} from '@sifxt/money-utils';

// Calculate line item (derived mode)
const item = calculateLineItem({
  unitPrice: '100',
  quantity: 2,
  taxRate: '18',
  discountAmount: '10',
  currency: 'INR'
});
// {
//   input: { unitPrice: '100', quantity: 2, discountAmount: '10', taxRate: '18' },
//   calculated: {
//     grossAmount: '200',       // 100 × 2
//     taxableAmount: '190',     // 200 - 10
//     taxAmount: '34.2',        // 190 × 18%
//     total: '224.2'            // 190 + 34.2
//   },
//   roundingAdjustment: '0',
//   currency: 'INR',
//   decimalPlaces: 2
// }

// Calculate from entered total (back-calculate unit price)
const fromTotal = calculateLineItemFromTotal('1180', 2, '18', '0', 'INR');
// Back-calculates unit price to match entered total
// Includes exactUnitPrice, displayedUnitPrice, and any adjustment needed

// Aggregate multiple line items
const items = [item1, item2, item3];
const invoice = aggregateLineItems(items, 'INR');
// {
//   totalTaxable: '...',
//   totalTax: '...',
//   totalBeforeAdjustment: '...',
//   totalAdjustment: '...',
//   grandTotal: '...',
//   itemCount: 3,
//   hasAdjustments: false,
//   items: [...],
//   currency: 'INR'
// }

// Verify invoice integrity
verifyInvoiceIntegrity(invoice);
// { isValid: true, errors: [], details: { ... } }
```

### Allocation & Distribution

```typescript
import { allocate, distribute, distributeRoundingAdjustment } from '@sifxt/money-utils';

// Distribute evenly (handles remainders)
distribute('100', 3);
// ['33.34', '33.33', '33.33']  // Sum = 100 exactly

distribute('1000', 3);
// ['333.34', '333.33', '333.33']

// Allocate proportionally
allocate('1000', [3, 2, 1]);
// Allocates in 3:2:1 ratio
// ['500', '333.33', '166.67']

// With rounding adjustment distribution
distributeRoundingAdjustment(['33.33', '33.33', '33.33'], '100', 2);
// ['33.34', '33.33', '33.33']
```

### Financial Helpers

```typescript
import { 
  calculateDiscount, 
  calculateCommission,
  simpleInterest,
  compoundInterest,
  calculateRoundOff,
  applyPriceMultiplier,
  calculateDiscountAmount
} from '@sifxt/money-utils';

// Discount calculation
calculateDiscount('1000', 10, undefined, 'INR');
// {
//   discountAmount: '100',
//   finalAmount: '900',
//   effectiveDiscountPercent: '10'
// }

// Commission with TDS and GST
calculateCommission('10000', '10', '10', '18', 'INR');
// {
//   commission: '1000',
//   gstOnCommission: '180',
//   tds: '100',
//   netCommission: '1080',
//   netToProperty: '8920'
// }

// Interest calculations
simpleInterest('10000', '12', '2');  // 2400 (P×R×T/100)
compoundInterest('10000', '12', 2, 12); // Monthly compounding for 2 years

// Round-off for invoice
calculateRoundOff('1234.67', 'NEAREST');
// { roundedAmount: '1235', roundOffAmount: '0.33' }

calculateRoundOff('1234.67', 'DOWN');
// { roundedAmount: '1234', roundOffAmount: '-0.67' }

// Apply price multiplier
applyPriceMultiplier('1000', 1.1);  // 1100 (10% markup)
applyPriceMultiplier('1000', 0.9);  // 900 (10% discount)

// Calculate discount amount
calculateDiscountAmount('1000', { value: 10 });    // 100 (10%)
calculateDiscountAmount('1000', { amount: 50 });   // 50 (fixed)

// Calculate percentage of total
calculatePercentageOfTotal('250', '1000', 'INR');  // '25'
```

### Ledger & Adjustment Functions

```typescript
import { 
  calculateLedgerTotal, calculateTotalAdjustment 
} from '@sifxt/money-utils';

// Calculate ledger totals (debits and credits)
const ledger = calculateLedgerTotal([
  { amount: '1000', type: 'debit' },
  { amount: '500', type: 'credit' },
  { amount: '200', type: 'debit' }
], 'INR');
// {
//   totalDebit: '1200',
//   totalCredit: '500',
//   balance: '700',
//   balanceType: 'debit'
// }

// Calculate total adjustment from rounding
calculateTotalAdjustment([
  { adjustment: '0.01' },
  { adjustment: '-0.02' },
  { adjustment: '0.005' }
], 'INR');
// '-0.005' (net adjustment)
```

### Precise Functions (Re-exports)

These are re-exported from `@sifxt/math-utils` for direct access:

```typescript
import { 
  // Precise arithmetic (string-based, BigInt internally)
  preciseAdd, preciseSubtract, preciseMultiply, preciseDivide,
  preciseRound, preciseAbs, preciseNegate,
  preciseMin, preciseMax, preciseSum, preciseAverage,
  
  // Precise comparisons
  preciseCompare, preciseEquals, preciseGreaterThan, preciseGreaterThanOrEqual,
  preciseLessThan, preciseLessThanOrEqual, preciseEqualsWithinThreshold,
  
  // Precise checks
  preciseIsZero, preciseIsPositive, preciseIsNegative, preciseInRange, preciseClamp,
  
  // Precise percentages
  precisePercentage, preciseAddPercentage, preciseSubtractPercentage, precisePercentageOf,
  
  // Precise distribution
  preciseDistribute, preciseAllocate,
  
  // Parsing utilities
  parseToString, isValidDecimalFormat, safeParsePreciseString,
  
  // Precision config
  PrecisionRoundingMode
} from '@sifxt/money-utils';

// All precise* functions work with strings for maximum precision
preciseAdd('0.1', '0.2');           // '0.3'
preciseRound('2.5', 0);             // '2' (Banker's rounding)
precisePercentage('1000', '18');    // '180'
preciseDistribute('100', 3);        // ['33.34', '33.33', '33.33']
```

### Constants & Configuration

```typescript
import { 
  // Default values
  DEFAULT_CURRENCY_CODE,        // 'INR'
  DEFAULT_ROUNDING_MODE,        // RoundingMode.ROUND_HALF_EVEN
  DEFAULT_DECIMAL_PLACES,       // 2
  DEFAULT_ROUNDING_CONFIG,      // { decimalPlaces: 2, mode: ROUND_HALF_EVEN }
  
  // Precision thresholds
  MATH_PRECISION,               // From @sifxt/math-utils
  MONEY_PRECISION,              // Money-specific thresholds
  
  // Currency data
  CURRENCY_CODES,               // { INR: 'INR', USD: 'USD', ... }
  CURRENCIES,                   // Full currency config map
  CURRENCY_SYMBOLS,             // { INR: '₹', USD: '$', ... }
  CURRENCY_DECIMAL_PLACES,      // { INR: 2, JPY: 0, KWD: 3, ... }
  CURRENCY_LOCALES,             // { INR: 'en-IN', USD: 'en-US', ... }
  CURRENCY_SMALLEST_UNITS,      // { INR: 'paise', USD: 'cents', ... }
  
  // Tax rates (Indian GST)
  TAX_RATES,                    // { GST_5: 5, GST_12: 12, GST_18: 18, ... }
  
  // Rounding modes enum
  RoundingMode
} from '@sifxt/money-utils';

// Example usage
console.log(CURRENCY_CODES.INR);           // 'INR'
console.log(CURRENCY_SYMBOLS.EUR);         // '€'
console.log(CURRENCY_DECIMAL_PLACES.JPY);  // 0
console.log(TAX_RATES.GST_18);             // 18
```

### Types & Interfaces

```typescript
import type { 
  // Core money types
  Money,                // { amount: string, currency: string }
  CurrencyMoney,        // Money & { decimalPlaces: number }
  
  // Currency types
  CurrencyCode,         // 'INR' | 'USD' | 'EUR' | ...
  CurrencyConfig,       // Full currency configuration
  
  // Rounding types
  RoundingAdjustment,   // { original, rounded, adjustment, ... }
  RoundingConfig        // { decimalPlaces, mode }
} from '@sifxt/money-utils';

// Money interface
const amount: Money = {
  amount: '1000.50',
  currency: 'INR'
};

// CurrencyMoney extends Money
const currencyAmount: CurrencyMoney = {
  amount: '1000.50',
  currency: 'INR',
  decimalPlaces: 2
};

// RoundingAdjustment for auditing
const adjustment: RoundingAdjustment = {
  original: '123.456',
  rounded: '123.46',
  adjustment: '0.004',
  decimalPlaces: 2,
  roundingMode: 'ROUND_HALF_EVEN',
  hasAdjustment: true
};
```

## Rounding Modes

| Mode | Description | 2.5 → | 3.5 → | -2.5 → |
|------|-------------|-------|-------|--------|
| `ROUND_HALF_EVEN` | Banker's rounding (default) | 2 | 4 | -2 |
| `ROUND_HALF_UP` | Standard rounding | 3 | 4 | -3 |
| `ROUND_HALF_DOWN` | Round ties towards zero | 2 | 3 | -2 |
| `ROUND_HALF_CEIL` | Round ties up | 3 | 4 | -2 |
| `ROUND_HALF_FLOOR` | Round ties down | 2 | 3 | -3 |
| `ROUND_CEIL` | Always round up | 3 | 4 | -2 |
| `ROUND_FLOOR` | Always round down | 2 | 3 | -3 |
| `ROUND_UP` | Round away from zero | 3 | 4 | -3 |
| `ROUND_DOWN` | Round towards zero | 2 | 3 | -2 |

## Supported Currencies

### Primary Currencies

| Code | Symbol | Decimals | Locale |
|------|--------|----------|--------|
| INR | ₹ | 2 | en-IN |
| USD | $ | 2 | en-US |
| EUR | € | 2 | de-DE |
| GBP | £ | 2 | en-GB |

### Asia-Pacific

| Code | Symbol | Decimals | Locale |
|------|--------|----------|--------|
| JPY | ¥ | 0 | ja-JP |
| CNY | ¥ | 2 | zh-CN |
| SGD | S$ | 2 | en-SG |
| AUD | A$ | 2 | en-AU |
| HKD | HK$ | 2 | zh-HK |
| KRW | ₩ | 0 | ko-KR |
| THB | ฿ | 2 | th-TH |
| MYR | RM | 2 | ms-MY |
| IDR | Rp | 0 | id-ID |
| PHP | ₱ | 2 | en-PH |
| VND | ₫ | 0 | vi-VN |

### Middle East

| Code | Symbol | Decimals | Locale |
|------|--------|----------|--------|
| AED | د.إ | 2 | ar-AE |
| SAR | ﷼ | 2 | ar-SA |
| KWD | د.ك | 3 | ar-KW |
| BHD | .د.ب | 3 | ar-BH |
| OMR | ﷼ | 3 | ar-OM |
| QAR | ﷼ | 2 | ar-QA |

### Americas & Europe

| Code | Symbol | Decimals | Locale |
|------|--------|----------|--------|
| CAD | C$ | 2 | en-CA |
| MXN | $ | 2 | es-MX |
| BRL | R$ | 2 | pt-BR |
| CHF | CHF | 2 | de-CH |
| SEK | kr | 2 | sv-SE |
| NOK | kr | 2 | nb-NO |
| DKK | kr | 2 | da-DK |

### South Asia

| Code | Symbol | Decimals | Locale |
|------|--------|----------|--------|
| LKR | Rs | 2 | si-LK |
| PKR | Rs | 2 | ur-PK |
| BDT | ৳ | 2 | bn-BD |
| NPR | Rs | 2 | ne-NP |
| MVR | Rf | 2 | dv-MV |

## Architecture

### SOLID Principles

**Single Responsibility (SRP)**
- `money.utils.ts` - Currency-aware operations and financial helpers
- `constant/money.ts` - Currency configurations and constants
- Precise arithmetic delegated to `@sifxt/math-utils`

**Open/Closed (OCP)**
- Currency configurations extensible without modifying core logic
- Rounding modes extensible via enum

**Liskov Substitution (LSP)**
- `Money` and `CurrencyMoney` interfaces are compatible
- All numeric inputs accept both `number` and `string`

**Interface Segregation (ISP)**
- Focused interfaces: `Money`, `CurrencyMoney`, `RoundingAdjustment`
- Separate exports for different use cases

**Dependency Inversion (DIP)**
- Precise arithmetic delegated to `@sifxt/math-utils`
- Configuration injected via constants
- Functions are pure and testable

### Why String-Based Arithmetic?

JavaScript's floating-point arithmetic has inherent precision issues:

```javascript
// JavaScript floating-point problem
0.1 + 0.2                    // 0.30000000000000004
0.1 * 0.2                    // 0.020000000000000004

// @sifxt/money-utils solution (BigInt-based)
add('0.1', '0.2');           // '0.3' ✓
multiply('0.1', '0.2');      // '0.02' ✓
```

This package uses `@sifxt/math-utils` which internally converts all numbers to BigInt for calculations, eliminating floating-point errors entirely.

## Best Practices

### Use String Inputs for Financial Data

```typescript
// ✅ Good - Use strings for precise values
const amount = add('1234.56', '789.01');
const tax = calculateGST('1000', '18');

// ⚠️ Acceptable - Numbers work but may have precision limits
const result = add(1234.56, 789.01);
```

### Always Specify Currency

```typescript
// ✅ Good - Explicit currency
roundForCurrency('99.999', 'INR');
calculateGST('1000', '18', 'INR');

// ⚠️ Works - Uses default INR
roundForCurrency('99.999');
```

### Use Currency-Aware Rounding for Final Amounts

```typescript
// ✅ Good - Round final amounts to currency precision
const subtotal = add(item1, item2, item3);
const total = roundForCurrency(subtotal, 'INR');

// ⚠️ Avoid - Manual rounding may not match currency
const total = round(subtotal, 2);
```

### Track Rounding Adjustments for Auditing

```typescript
// ✅ Good - Track adjustments for reconciliation
const { rounded, adjustment, hasAdjustment } = roundWithAdjustment('123.456', 2);
if (hasAdjustment) {
  console.log(`Adjustment: ${adjustment}`);
}
```

### Validate Line Items

```typescript
// ✅ Good - Use validation
const validation = validateLineItemInput(input);
if (!validation.isValid) {
  console.error(validation.errors);
  return;
}
```

## License

MIT © [Sifat Singh](https://github.com/sifXt)
