/**
 * Money Utilities Usage Examples
 * Demonstrates all the money utility functions
 */

import * as Money from './money.utils';
import { RoundingMode } from './constant/money';

// ============================================================================
// BASIC ARITHMETIC OPERATIONS
// ============================================================================

// Addition
const sum1 = Money.add('100.50', '200.75'); // "301.25"
const sum2 = Money.add(100.5, 200.75); // "301.25"

// Subtraction
const diff = Money.subtract('500.00', '123.45'); // "376.55"

// Multiplication
const product = Money.multiply('12.50', '3'); // "37.5"

// Division
const quotient = Money.divide('100', '3'); // "33.33333333333333333333"

// ============================================================================
// COMPARISON OPERATIONS
// ============================================================================

const isEqual = Money.equals('100.00', '100'); // true
const isGreater = Money.greaterThan('150', '100'); // true
const isLess = Money.lessThan('50', '100'); // true
const comparison = Money.compare('100', '50'); // 1 (positive means first is greater)

// ============================================================================
// ROUNDING OPERATIONS
// ============================================================================

// Default rounding (ROUND_HALF_EVEN)
const rounded1 = Money.round('123.456', 2); // "123.46"
const rounded2 = Money.round('123.455', 2); // "123.46" (banker's rounding)

// Round up
const roundedUp = Money.round('123.451', 2, RoundingMode.ROUND_UP); // "123.46"

// Round down
const roundedDown = Money.round('123.459', 2, RoundingMode.ROUND_DOWN); // "123.45"

// Round to integer
const roundedInt = Money.round('123.789', 0); // "124"

// ============================================================================
// PERCENTAGE CALCULATIONS
// ============================================================================

// Calculate percentage
const tax = Money.percentage('1000', '18'); // "180" (18% of 1000)

// Add percentage (e.g., add 18% GST)
const withTax = Money.addPercentage('1000', '18'); // "1180"

// Subtract percentage (e.g., discount)
const afterDiscount = Money.subtractPercentage('1000', '10'); // "900"

// Calculate what percentage one value is of another
const percentOf = Money.percentageOf('250', '1000'); // "25"

// ============================================================================
// MIN/MAX/SUM OPERATIONS
// ============================================================================

const minimum = Money.min('100', '50', '75', '25'); // "25"
const maximum = Money.max('100', '50', '75', '25'); // "100"
const total = Money.sum('100', '50', '75', '25'); // "250"
const avg = Money.average('100', '50', '75', '25'); // "62.5"

// ============================================================================
// MONEY OBJECT OPERATIONS
// ============================================================================

// Create Money objects
const amount1 = Money.createMoney('1000', 'INR');
const amount2 = Money.createMoney('500', 'INR');

// Add Money objects
const totalAmount = Money.addMoney(amount1, amount2); // { amount: "1500", currency: "INR" }

// Multiply Money
const doubled = Money.multiplyMoney(amount1, 2); // { amount: "2000", currency: "INR" }

// Round Money
const roundedMoney = Money.roundMoney(
  Money.createMoney('1234.567', 'INR'),
  2,
); // { amount: "1234.57", currency: "INR" }

// ============================================================================
// ALLOCATION AND DISTRIBUTION
// ============================================================================

// Allocate amount proportionally based on ratios
const allocated = Money.allocate('1000', [3, 2, 1]); 
// ["500.00", "333.33", "166.67"] - distributed in 3:2:1 ratio

// Distribute evenly
const distributed = Money.distribute('100', 3); 
// ["33.34", "33.33", "33.33"] - splits evenly with remainder handling

// ============================================================================
// CURRENCY CONVERSION
// ============================================================================

// Convert to smallest unit (rupees to paise)
const paise = Money.toSmallestUnit('123.45', 2); // "12345"

// Convert from smallest unit (paise to rupees)
const rupees = Money.fromSmallestUnit('12345', 2); // "123.45"

// ============================================================================
// FORMATTING
// ============================================================================

// Format as currency
const formatted1 = Money.formatMoney('1234.56', 'INR', 'en-IN'); // "₹1,234.56"
const formatted2 = Money.formatMoney('1234.56', 'USD', 'en-US'); // "$1,234.56"

// Parse formatted money string
const parsed = Money.parseMoney('₹1,234.56'); // "1234.56"

// ============================================================================
// INTEREST CALCULATIONS
// ============================================================================

// Simple interest (P * R * T / 100)
const simpleInt = Money.simpleInterest('10000', '10', '2'); // "2000"

// Compound interest
const compoundInt = Money.compoundInterest('10000', '10', 2, 1); // "2100"

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Absolute value
const absolute = Money.abs('-123.45'); // "123.45"

// Negate
const negated = Money.negate('123.45'); // "-123.45"

// Check if zero
const isZero = Money.isZero('0.00'); // true

// Check if positive/negative
const isPositive = Money.isPositive('100'); // true
const isNegative = Money.isNegative('-100'); // true

// Clamp value between min and max
const clamped = Money.clamp('150', '0', '100'); // "100"

// Check if in range
const inRange = Money.inRange('50', '0', '100'); // true

// ============================================================================
// PRACTICAL EXAMPLE: HOTEL BOOKING CALCULATION
// ============================================================================

function calculateBookingTotal(
  roomRate: string,
  nights: number,
  gstPercent: string,
  discount: string,
): {
  subtotal: string;
  discountAmount: string;
  afterDiscount: string;
  gstAmount: string;
  total: string;
} {
  // Calculate subtotal
  const subtotal = Money.multiply(roomRate, nights.toString());
  
  // Calculate discount
  const discountAmount = Money.percentage(subtotal, discount);
  const afterDiscount = Money.subtract(subtotal, discountAmount);
  
  // Calculate GST
  const gstAmount = Money.percentage(afterDiscount, gstPercent);
  
  // Calculate total
  const total = Money.add(afterDiscount, gstAmount);
  
  return {
    subtotal: Money.round(subtotal, 2),
    discountAmount: Money.round(discountAmount, 2),
    afterDiscount: Money.round(afterDiscount, 2),
    gstAmount: Money.round(gstAmount, 2),
    total: Money.round(total, 2),
  };
}

// Example usage
const booking = calculateBookingTotal('5000', 3, '18', '10');
console.log('Booking Calculation:', booking);
// {
//   subtotal: "15000.00",
//   discountAmount: "1500.00",
//   afterDiscount: "13500.00",
//   gstAmount: "2430.00",
//   total: "15930.00"
// }

// ============================================================================
// PRACTICAL EXAMPLE: SPLIT BILL AMONG GUESTS
// ============================================================================

function splitBill(totalAmount: string, numberOfGuests: number): {
  perPerson: string[];
  total: string;
  verification: boolean;
} {
  const shares = Money.distribute(totalAmount, numberOfGuests);
  const calculatedTotal = Money.sum(...shares);
  
  return {
    perPerson: shares,
    total: calculatedTotal,
    verification: Money.equals(calculatedTotal, totalAmount),
  };
}

// Example: Split ₹1000 among 3 guests
const billSplit = splitBill('1000', 3);
console.log('Bill Split:', billSplit);
// {
//   perPerson: ["333.34", "333.33", "333.33"],
//   total: "1000.00",
//   verification: true
// }

export {
  sum1,
  diff,
  product,
  quotient,
  rounded1,
  tax,
  totalAmount,
  allocated,
  formatted1,
  calculateBookingTotal,
  splitBill,
};
