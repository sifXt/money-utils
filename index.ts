/**
 * @sifxt/money-utils
 * A comprehensive TypeScript money utilities library with currency-aware operations,
 * precise decimal arithmetic, and financial calculation helpers.
 *
 * @description
 * This package provides enterprise-grade financial calculations with:
 * - BigInt-based precision arithmetic (zero floating-point errors)
 * - 50+ currency support with proper decimal places
 * - 9 rounding modes including Banker's rounding
 * - GST/Tax calculations with CGST/SGST split
 * - Invoice line item calculations with audit trails
 * - Rounding adjustment tracking for financial reconciliation
 *
 * @example
 * ```typescript
 * import * as Money from '@sifxt/money-utils';
 *
 * // Basic arithmetic (string-based for precision)
 * Money.add('100.50', '200.75');      // '301.25'
 * Money.multiply('0.1', '0.2');       // '0.02'
 *
 * // Currency-aware rounding
 * Money.round('123.456', 2);          // '123.46'
 * Money.roundForCurrency('99.999', 'INR'); // '100'
 *
 * // GST calculations
 * Money.calculateGST('1000', '18');   // { cgst: '90', sgst: '90', ... }
 *
 * // Invoice calculations
 * Money.calculateLineItem({ unitPrice: '100', quantity: 2, taxRate: '18' });
 * ```
 *
 * @requires @sifxt/math-utils ^2.0.0
 * @author Sifat Singh <sifatsingh7059@gmail.com>
 * @license MIT
 * @see https://github.com/sifXt/money-utils
 */

export * from './money.utils';
export * from './constant/money';
