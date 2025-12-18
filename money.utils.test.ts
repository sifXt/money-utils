/**
 * Money Utilities Test Suite
 * Comprehensive tests for all money utility functions
 */

import * as Money from './money.utils';
import { RoundingMode } from './constant/money';

describe('Money Utilities', () => {
    describe('Basic Arithmetic', () => {
        test('add - should add two numbers correctly', () => {
            expect(Money.add('100.50', '200.75')).toBe('301.25');
            expect(Money.add('0.1', '0.2')).toBe('0.3');
            expect(Money.add('-50', '100')).toBe('50');
        });

        test('subtract - should subtract correctly', () => {
            expect(Money.subtract('500', '123.45')).toBe('376.55');
            expect(Money.subtract('100', '200')).toBe('-100');
            expect(Money.subtract('0.3', '0.1')).toBe('0.2');
        });

        test('multiply - should multiply correctly', () => {
            expect(Money.multiply('12.50', '3')).toBe('37.5');
            expect(Money.multiply('0.1', '0.2')).toBe('0.02');
            expect(Money.multiply('-5', '10')).toBe('-50');
        });

        test('divide - should divide correctly', () => {
            expect(Money.divide('100', '4')).toBe('25');
            expect(Money.divide('10', '3', 2)).toBe('3.33');
            expect(Money.divide('1', '8', 3)).toBe('0.125');
        });

        test('divide - should throw error on division by zero', () => {
            expect(() => Money.divide('100', '0')).toThrow('Division by zero');
        });
    });

    describe('Comparison Operations', () => {
        test('compare - should compare numbers correctly', () => {
            expect(Money.compare('100', '50')).toBe(1);
            expect(Money.compare('50', '100')).toBe(-1);
            expect(Money.compare('100', '100')).toBe(0);
        });

        test('equals - should check equality correctly', () => {
            expect(Money.equals('100', '100')).toBe(true);
            expect(Money.equals('100.00', '100')).toBe(true);
            expect(Money.equals('100', '100.01')).toBe(false);
        });

        test('greaterThan - should check if greater', () => {
            expect(Money.greaterThan('150', '100')).toBe(true);
            expect(Money.greaterThan('100', '150')).toBe(false);
            expect(Money.greaterThan('100', '100')).toBe(false);
        });

        test('lessThan - should check if less', () => {
            expect(Money.lessThan('50', '100')).toBe(true);
            expect(Money.lessThan('100', '50')).toBe(false);
            expect(Money.lessThan('100', '100')).toBe(false);
        });

        test('greaterThanOrEqual - should check if greater or equal', () => {
            expect(Money.greaterThanOrEqual('150', '100')).toBe(true);
            expect(Money.greaterThanOrEqual('100', '100')).toBe(true);
            expect(Money.greaterThanOrEqual('50', '100')).toBe(false);
        });

        test('lessThanOrEqual - should check if less or equal', () => {
            expect(Money.lessThanOrEqual('50', '100')).toBe(true);
            expect(Money.lessThanOrEqual('100', '100')).toBe(true);
            expect(Money.lessThanOrEqual('150', '100')).toBe(false);
        });
    });

    describe('Rounding Operations', () => {
        test('round - default (ROUND_HALF_EVEN)', () => {
            expect(Money.round('123.455', 2)).toBe('123.46');
            expect(Money.round('123.445', 2)).toBe('123.44');
            expect(Money.round('123.5', 0)).toBe('124');
            expect(Money.round('124.5', 0)).toBe('124');
        });

        test('round - ROUND_UP', () => {
            expect(Money.round('123.451', 2, RoundingMode.ROUND_UP)).toBe(
                '123.46',
            );
            expect(Money.round('123.001', 2, RoundingMode.ROUND_UP)).toBe(
                '123.01',
            );
        });

        test('round - ROUND_DOWN', () => {
            expect(Money.round('123.459', 2, RoundingMode.ROUND_DOWN)).toBe(
                '123.45',
            );
            expect(Money.round('123.999', 2, RoundingMode.ROUND_DOWN)).toBe(
                '123.99',
            );
        });

        test('round - ROUND_HALF_UP', () => {
            expect(Money.round('123.455', 2, RoundingMode.ROUND_HALF_UP)).toBe(
                '123.46',
            );
            expect(Money.round('123.445', 2, RoundingMode.ROUND_HALF_UP)).toBe(
                '123.45',
            );
        });
    });

    describe('Percentage Calculations', () => {
        test('percentage - should calculate percentage', () => {
            expect(Money.percentage('1000', '18')).toBe('180');
            expect(Money.percentage('100', '50')).toBe('50');
            expect(Money.percentage('250', '10')).toBe('25');
        });

        test('addPercentage - should add percentage', () => {
            expect(Money.addPercentage('1000', '18')).toBe('1180');
            expect(Money.addPercentage('100', '50')).toBe('150');
        });

        test('subtractPercentage - should subtract percentage', () => {
            expect(Money.subtractPercentage('1000', '10')).toBe('900');
            expect(Money.subtractPercentage('200', '25')).toBe('150');
        });

        test('percentageOf - should calculate what percentage', () => {
            expect(Money.percentageOf('250', '1000')).toBe('25');
            expect(Money.percentageOf('50', '200')).toBe('25');
        });
    });

    describe('Aggregate Operations', () => {
        test('min - should return minimum value', () => {
            expect(Money.min('100', '50', '75', '25')).toBe('25');
            expect(Money.min('100')).toBe('100');
        });

        test('max - should return maximum value', () => {
            expect(Money.max('100', '50', '75', '25')).toBe('100');
            expect(Money.max('50')).toBe('50');
        });

        test('sum - should sum all values', () => {
            expect(Money.sum('100', '50', '75', '25')).toBe('250');
            expect(Money.sum('100')).toBe('100');
            expect(Money.sum()).toBe('0');
        });

        test('average - should calculate average', () => {
            expect(Money.average('100', '50', '75', '25')).toBe('62.5');
            expect(Money.average('100')).toBe('100');
        });
    });

    describe('Money Object Operations', () => {
        test('createMoney - should create Money object', () => {
            const money = Money.createMoney('1000', 'INR');
            expect(money).toEqual({ amount: '1000', currency: 'INR' });
        });

        test('addMoney - should add Money objects', () => {
            const a = Money.createMoney('1000', 'INR');
            const b = Money.createMoney('500', 'INR');
            const result = Money.addMoney(a, b);
            expect(result).toEqual({ amount: '1500', currency: 'INR' });
        });

        test('addMoney - should throw on different currencies', () => {
            const inr = Money.createMoney('1000', 'INR');
            const usd = Money.createMoney('100', 'USD');
            expect(() => Money.addMoney(inr, usd)).toThrow();
        });

        test('multiplyMoney - should multiply Money by factor', () => {
            const money = Money.createMoney('100', 'INR');
            const result = Money.multiplyMoney(money, 2.5);
            expect(result).toEqual({ amount: '250', currency: 'INR' });
        });

        test('roundMoney - should round Money object', () => {
            const money = Money.createMoney('1234.567', 'INR');
            const result = Money.roundMoney(money, 2);
            expect(result).toEqual({ amount: '1234.57', currency: 'INR' });
        });
    });

    describe('Allocation and Distribution', () => {
        test('allocate - should allocate proportionally', () => {
            const result = Money.allocate('1000', [3, 2, 1]);
            expect(result).toHaveLength(3);
            expect(Money.sum(...result)).toBe('1000');
        });

        test('distribute - should distribute evenly', () => {
            const result = Money.distribute('100', 3);
            expect(result).toHaveLength(3);
            expect(Money.sum(...result)).toBe('100');
        });

        test('distribute - should handle remainder correctly', () => {
            const result = Money.distribute('10', 3);
            expect(Money.sum(...result)).toBe('10');
        });
    });

    describe('Currency Conversion', () => {
        test('toSmallestUnit - should convert to smallest unit', () => {
            expect(Money.toSmallestUnit('123.45', 2)).toBe('12345');
            expect(Money.toSmallestUnit('1.50', 2)).toBe('150');
        });

        test('fromSmallestUnit - should convert from smallest unit', () => {
            expect(Money.fromSmallestUnit('12345', 2)).toBe('123.45');
            expect(Money.fromSmallestUnit('150', 2)).toBe('1.5');
        });
    });

    describe('Utility Functions', () => {
        test('abs - should return absolute value', () => {
            expect(Money.abs('-123.45')).toBe('123.45');
            expect(Money.abs('123.45')).toBe('123.45');
        });

        test('negate - should negate value', () => {
            expect(Money.negate('123.45')).toBe('-123.45');
            expect(Money.negate('-123.45')).toBe('123.45');
            expect(Money.negate('0')).toBe('0');
        });

        test('isZero - should check if zero', () => {
            expect(Money.isZero('0')).toBe(true);
            expect(Money.isZero('0.00')).toBe(true);
            expect(Money.isZero('0.01')).toBe(false);
        });

        test('isPositive - should check if positive', () => {
            expect(Money.isPositive('100')).toBe(true);
            expect(Money.isPositive('0')).toBe(false);
            expect(Money.isPositive('-100')).toBe(false);
        });

        test('isNegative - should check if negative', () => {
            expect(Money.isNegative('-100')).toBe(true);
            expect(Money.isNegative('0')).toBe(false);
            expect(Money.isNegative('100')).toBe(false);
        });

        test('clamp - should clamp value between min and max', () => {
            expect(Money.clamp('150', '0', '100')).toBe('100');
            expect(Money.clamp('-10', '0', '100')).toBe('0');
            expect(Money.clamp('50', '0', '100')).toBe('50');
        });

        test('inRange - should check if in range', () => {
            expect(Money.inRange('50', '0', '100')).toBe(true);
            expect(Money.inRange('0', '0', '100')).toBe(true);
            expect(Money.inRange('100', '0', '100')).toBe(true);
            expect(Money.inRange('150', '0', '100')).toBe(false);
        });
    });

    describe('Interest Calculations', () => {
        test('simpleInterest - should calculate simple interest', () => {
            expect(Money.simpleInterest('10000', '10', '2')).toBe('2000');
            expect(Money.simpleInterest('5000', '5', '1')).toBe('250');
        });

        test('compoundInterest - should calculate compound interest', () => {
            const result = Money.compoundInterest('10000', '10', 2, 1);
            expect(Money.round(result, 2)).toBe('2100.00');
        });
    });

    describe('Practical Scenarios', () => {
        test('hotel booking calculation', () => {
            const roomRate = '5000';
            const nights = 3;
            const subtotal = Money.multiply(roomRate, nights.toString());
            const discount = Money.percentage(subtotal, '10');
            const afterDiscount = Money.subtract(subtotal, discount);
            const gst = Money.percentage(afterDiscount, '18');
            const total = Money.add(afterDiscount, gst);

            expect(Money.round(subtotal, 2)).toBe('15000.00');
            expect(Money.round(discount, 2)).toBe('1500.00');
            expect(Money.round(afterDiscount, 2)).toBe('13500.00');
            expect(Money.round(gst, 2)).toBe('2430.00');
            expect(Money.round(total, 2)).toBe('15930.00');
        });

        test('split bill among guests', () => {
            const totalBill = '1000';
            const guests = 3;
            const shares = Money.distribute(totalBill, guests);
            const calculatedTotal = Money.sum(...shares);

            expect(shares).toHaveLength(3);
            expect(Money.equals(calculatedTotal, totalBill)).toBe(true);
        });

        test('floating point precision', () => {
            // This would fail with regular JavaScript numbers: 0.1 + 0.2 = 0.30000000000000004
            expect(Money.add('0.1', '0.2')).toBe('0.3');
            expect(Money.subtract('0.3', '0.1')).toBe('0.2');
        });
    });

  describe('Money Helper Functions', () => {
    test('roundCurrencyNumber - should round string and respect currency decimals', () => {
      expect(Money.roundCurrencyNumber('123.456', 'INR')).toBe(123.46);
      expect(Money.roundCurrencyNumber('123.456', 'JPY')).toBe(123);
    });

    test('addMoneyNumbers - should add numbers and strings', () => {
      expect(Money.addMoneyNumbers([100, '200.25', 50.1])).toBe(350.35);
    });

    test('subtractMoneyNumbers - should subtract values', () => {
      expect(Money.subtractMoneyNumbers(200, 75.55)).toBe(124.45);
    });

    test('multiplyMoneyNumbers - should multiply and round', () => {
      expect(Money.multiplyMoneyNumbers(1666.666, 3)).toBe(5000);
    });

    test('percentageNumber - should calculate percentage as number', () => {
      expect(Money.percentageNumber(2000, 18)).toBe(360);
    });

    test('subtractMoneyList - should subtract list of values', () => {
      expect(Money.subtractMoneyList(1000, [100, 200.5, 50])).toBe(649.5);
    });

    test('calculateLedgerTotal - should sum credits and debits respecting status', () => {
      const entries = [
        { amount: 200, type: 'CREDIT', isActive: true },
        { amount: 50, type: 'DEBIT', isActive: true },
        { amount: 25, type: 'CREDIT', isActive: false }, // ignored
      ];
      expect(Money.calculateLedgerTotal(entries)).toBe(150);
    });
  });

    describe('Invoice Line Item Calculations', () => {
        describe('calculateLineItem (Derived Mode)', () => {
            test('should calculate line item with tax', () => {
                const result = Money.calculateLineItem({
                    unitPrice: '1000',
                    quantity: 2,
                    taxRate: '18',
                    currency: 'INR',
                });

                expect(result.calculated.grossAmount).toBe('2000.00');
                expect(result.calculated.taxableAmount).toBe('2000.00');
                expect(result.calculated.taxAmount).toBe('360.00');
                expect(result.calculated.total).toBe('2360.00');
                expect(result.roundingAdjustment).toBe('0');
            });

            test('should calculate line item with discount', () => {
                const result = Money.calculateLineItem({
                    unitPrice: '1000',
                    quantity: 3,
                    discountAmount: '500',
                    taxRate: '18',
                    currency: 'INR',
                });

                expect(result.calculated.grossAmount).toBe('3000.00');
                expect(result.calculated.taxableAmount).toBe('2500.00');
                expect(result.calculated.taxAmount).toBe('450.00');
                expect(result.calculated.total).toBe('2950.00');
            });

            test('should handle division resulting in repeating decimal', () => {
                // 5000 ÷ 3 = 1666.666...
                const result = Money.calculateLineItem({
                    unitPrice: '1666.67', // rounded
                    quantity: 3,
                    taxRate: '0',
                    currency: 'INR',
                });

                // 1666.67 × 3 = 5000.01 (one paisa off)
                expect(result.calculated.grossAmount).toBe('5000.01');
            });

            test('should clamp negative discount to zero', () => {
                const validated = Money.validateLineItemInput({
                    unitPrice: '100',
                    quantity: 1,
                    discountAmount: '-50',
                    taxRate: '18',
                });

                expect(validated.discountAmount).toBe('0');
                expect(validated.errors).toContain(
                    'Discount cannot be negative',
                );
            });

            test('should clamp tax rate to 0-100 range', () => {
                const validated = Money.validateLineItemInput({
                    unitPrice: '100',
                    quantity: 1,
                    taxRate: '150',
                });

                expect(validated.taxRate).toBe('100');
                expect(validated.errors).toContain(
                    'Tax rate cannot exceed 100%',
                );
            });
        });

        describe('calculateLineItemFromTotal (Entered Mode)', () => {
            test('should back-calculate unit price from entered total', () => {
                // User enters total = 1180, quantity = 1, tax = 18%
                // Expected: taxable = 1000, unit price = 1000
                const result = Money.calculateLineItemFromTotal(
                    '1180',
                    1,
                    '18',
                    '0',
                    'INR',
                );

                expect(result.displayedUnitPrice).toBe('1000.00');
                expect(result.calculated.taxableAmount).toBe('1000.00');
                expect(result.calculated.taxAmount).toBe('180.00');
                expect(result.calculated.total).toBe('1180.00');
                expect(result.roundingAdjustment).toBe('0');
                expect(result.hasAdjustment).toBe(false);
            });

            test('should calculate adjustment when rounding causes mismatch', () => {
                // User enters total = 5000, quantity = 3, tax = 18%
                // Back-calculation: taxable = 5000/1.18 = 4237.288...
                // unit = 4237.29 / 3 = 1412.43
                // Recomputed: 1412.43 × 3 = 4237.29 → + 18% tax = 4999.99
                // Adjustment = 5000 - 4999.99 = 0.01
                const result = Money.calculateLineItemFromTotal(
                    '5000',
                    3,
                    '18',
                    '0',
                    'INR',
                );

                expect(result.calculated.total).toBe('5000.00'); // Preserves entered total
                expect(result.hasAdjustment).toBe(true);
            });
        });

        describe('aggregateLineItems', () => {
            test('should aggregate multiple line items', () => {
                const items = [
                    Money.calculateLineItem({
                        unitPrice: '1000',
                        quantity: 2,
                        taxRate: '18',
                        currency: 'INR',
                    }),
                    Money.calculateLineItem({
                        unitPrice: '500',
                        quantity: 3,
                        taxRate: '18',
                        currency: 'INR',
                    }),
                    Money.calculateLineItem({
                        unitPrice: '750',
                        quantity: 1,
                        discountAmount: '100',
                        taxRate: '18',
                        currency: 'INR',
                    }),
                ];

                const aggregation = Money.aggregateLineItems(items, 'INR');

                // Item 1: gross=2000, taxable=2000, tax=360, total=2360
                // Item 2: gross=1500, taxable=1500, tax=270, total=1770
                // Item 3: gross=750, taxable=650, tax=117, total=767
                expect(aggregation.itemCount).toBe(3);
                expect(aggregation.totalTaxable).toBe('4150.00');
                expect(aggregation.totalTax).toBe('747.00');
                expect(aggregation.grandTotal).toBe('4897.00');
                expect(aggregation.hasAdjustments).toBe(false);
            });

            test('should handle empty items array', () => {
                const aggregation = Money.aggregateLineItems([], 'INR');

                expect(aggregation.itemCount).toBe(0);
                expect(aggregation.grandTotal).toBe('0');
            });
        });

        describe('verifyInvoiceIntegrity', () => {
            test('should verify valid invoice', () => {
                const items = [
                    Money.calculateLineItem({
                        unitPrice: '1000',
                        quantity: 1,
                        taxRate: '18',
                        currency: 'INR',
                    }),
                    Money.calculateLineItem({
                        unitPrice: '500',
                        quantity: 2,
                        taxRate: '12',
                        currency: 'INR',
                    }),
                ];

                const aggregation = Money.aggregateLineItems(items, 'INR');
                const verification = Money.verifyInvoiceIntegrity(aggregation);

                expect(verification.isValid).toBe(true);
                expect(verification.errors).toHaveLength(0);
            });
        });

        describe('splitTaxCGSTSGST', () => {
            test('should split tax evenly', () => {
                const { cgst, sgst } = Money.splitTaxCGSTSGST('180', 'INR');

                expect(cgst).toBe('90.00');
                expect(sgst).toBe('90.00');
            });

            test('should handle odd tax amounts', () => {
                const { cgst, sgst } = Money.splitTaxCGSTSGST('181', 'INR');

                // 181 / 2 = 90.5, rounded = 90.50
                // sgst = 181 - 90.50 = 90.50
                expect(Money.add(cgst, sgst)).toBe('181');
            });
        });

        describe('calculateRoundOff', () => {
            test('should round to nearest', () => {
                const { roundedAmount, roundOffAmount } =
                    Money.calculateRoundOff('1234.56');

                expect(roundedAmount).toBe('1235');
                expect(roundOffAmount).toBe('0.44');
            });

            test('should round up', () => {
                const { roundedAmount, roundOffAmount } =
                    Money.calculateRoundOff('1234.01', 'UP');

                expect(roundedAmount).toBe('1235');
                expect(roundOffAmount).toBe('0.99');
            });

            test('should round down', () => {
                const { roundedAmount, roundOffAmount } =
                    Money.calculateRoundOff('1234.99', 'DOWN');

                expect(roundedAmount).toBe('1234');
                expect(roundOffAmount).toBe('-0.99');
            });
        });
    });

    describe('Rounding Adjustment Tracking', () => {
        test('roundWithAdjustment should track difference', () => {
            const result = Money.roundWithAdjustment('123.456', 2);

            expect(result.original).toBe('123.456');
            expect(result.rounded).toBe('123.46');
            expect(result.adjustment).toBe('0.004');
            expect(result.hasAdjustment).toBe(true);
        });

        test('roundForCurrencyWithAdjustment should use currency decimals', () => {
            // JPY has 0 decimal places
            const jpyResult = Money.roundForCurrencyWithAdjustment(
                '123.456',
                'JPY',
            );
            expect(jpyResult.rounded).toBe('123');
            expect(jpyResult.decimalPlaces).toBe(0);

            // KWD has 3 decimal places
            const kwdResult = Money.roundForCurrencyWithAdjustment(
                '123.4567',
                'KWD',
            );
            expect(kwdResult.rounded).toBe('123.457');
            expect(kwdResult.decimalPlaces).toBe(3);
        });

        test('distributeRoundingAdjustment should ensure total matches', () => {
            const values = ['33.33', '33.33', '33.33'];
            const adjusted = Money.distributeRoundingAdjustment(
                values,
                '100',
                2,
            );

            expect(Money.sum(...adjusted)).toBe('100');
            // One item gets extra penny
            expect(adjusted).toContain('33.34');
        });
    });
});
