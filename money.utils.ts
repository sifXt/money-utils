/**
 * @sifxt/money-utils
 * Currency-aware financial calculations using @sifxt/math-utils for precision
 *
 * @description
 * This module provides a thin wrapper around @sifxt/math-utils precise functions,
 * adding currency awareness, formatting, and domain-specific financial helpers.
 *
 * @features
 * - Currency-aware operations with proper decimal places (50+ currencies)
 * - 9 rounding modes including Banker's rounding (ROUND_HALF_EVEN)
 * - Rounding adjustment tracking for financial auditing
 * - GST/Tax calculation helpers (CGST/SGST split)
 * - Invoice line item calculations with audit trails
 * - Commission, discount, and interest calculations
 * - Zero floating-point errors (BigInt-based arithmetic)
 *
 * @principle DIP Compliance
 * All precise arithmetic is delegated to @sifxt/math-utils:
 * - preciseAdd, preciseSubtract, preciseMultiply, preciseDivide
 * - preciseRound, preciseCompare, preciseEquals
 * - preciseMin, preciseMax, preciseSum, preciseClamp
 * - precisePercentage, precisePercentageOf
 * - preciseDistribute, preciseAllocate
 *
 * @author Sifat Singh <sifatsingh7059@gmail.com>
 * @license MIT
 * @see https://github.com/sifXt/money-utils
 */

import {
    // Standard numeric functions
    max as mathMax,
    min as mathMin,
    floor as mathFloor,
    ceil as mathCeil,
    round as mathRound,
    pow as mathPow,
    clamp as mathClamp,
    abs as mathAbs,
    compare as mathCompare,
    sign as mathSign,
    isValidNumber,
    isPositive as mathIsPositive,
    isNegative as mathIsNegative,
    isZero as mathIsZero,
    isInteger as mathIsInteger,
    toNumber,
    safeToNumber,
    // Precise decimal functions (BigInt-based)
    parseToString,
    preciseAdd,
    preciseSubtract,
    preciseMultiply,
    preciseDivide,
    preciseCompare,
    preciseEquals,
    preciseGreaterThan,
    preciseGreaterThanOrEqual,
    preciseLessThan,
    preciseLessThanOrEqual,
    preciseAbs,
    preciseNegate,
    preciseRound,
    preciseMin,
    preciseMax,
    preciseSum,
    precisePercentage,
    preciseAddPercentage,
    preciseSubtractPercentage,
    precisePercentageOf,
    preciseIsZero,
    preciseIsPositive,
    preciseIsNegative,
    preciseClamp,
    preciseInRange,
    preciseAverage,
    preciseDistribute,
    preciseAllocate,
    preciseEqualsWithinThreshold,
    isValidDecimalFormat,
    safeParsePreciseString,
    // Constants
    PrecisionRoundingMode,
    DEFAULT_PRECISION_ROUNDING_MODE,
    DEFAULT_PRECISION_DECIMAL_PLACES,
    PRECISION,
} from '@sifxt/math-utils';

import {
    RoundingMode,
    DEFAULT_ROUNDING_MODE,
    DEFAULT_DECIMAL_PLACES,
    RoundingAdjustment,
    RoundingConfig,
    DEFAULT_ROUNDING_CONFIG,
    CurrencyConfig,
    getCurrencyConfig,
    getCurrencyDecimalPlaces,
    isValidCurrency,
    PRECISION as MONEY_PRECISION,
} from './constant/money';

// =============================================================================
// RE-EXPORTS
// =============================================================================

export {
    RoundingMode,
    DEFAULT_ROUNDING_MODE,
    DEFAULT_DECIMAL_PLACES,
    getCurrencyConfig,
    getCurrencyDecimalPlaces,
    isValidCurrency,
};

export type { RoundingAdjustment, RoundingConfig, CurrencyConfig };

// Re-export precise functions (string-based, for exact arithmetic)
// These return strings to preserve precision
export {
    parseToString,
    preciseAdd,
    preciseSubtract,
    preciseMultiply,
    preciseDivide,
    preciseCompare,
    preciseEquals,
    preciseGreaterThan,
    preciseGreaterThanOrEqual,
    preciseLessThan,
    preciseLessThanOrEqual,
    preciseAbs,
    preciseNegate,
    preciseMin,
    preciseMax,
    preciseSum,
    precisePercentage,
    preciseAddPercentage,
    preciseSubtractPercentage,
    precisePercentageOf,
    preciseIsZero,
    preciseIsPositive,
    preciseIsNegative,
    preciseClamp,
    preciseInRange,
    preciseAverage,
    preciseDistribute,
    preciseAllocate,
    preciseEqualsWithinThreshold,
    isValidDecimalFormat,
    safeParsePreciseString,
    PrecisionRoundingMode,
};

// Short aliases for precise functions (string-returning)
// These are convenient aliases for the precise* functions above
export {
    preciseAdd as add,
    preciseSubtract as subtract,
    preciseMultiply as multiply,
    preciseDivide as divide,
    preciseCompare as compare,
    preciseEquals as equals,
    preciseGreaterThan as greaterThan,
    preciseGreaterThanOrEqual as greaterThanOrEqual,
    preciseLessThan as lessThan,
    preciseLessThanOrEqual as lessThanOrEqual,
    preciseAbs as abs,
    preciseNegate as negate,
    preciseMin as min,
    preciseMax as max,
    preciseSum as sum,
    precisePercentageOf as percentageOf,
    preciseIsZero as isZero,
    preciseIsPositive as isPositive,
    preciseIsNegative as isNegative,
    preciseClamp as clamp,
    preciseInRange as inRange,
    preciseAverage as average,
    preciseDistribute as distribute,
    preciseAllocate as allocate,
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Interface for money amount with currency
 */
export interface Money {
    amount: string;
    currency: string;
}

/**
 * Extended Money interface with currency configuration
 */
export interface CurrencyMoney extends Money {
    /** Currency configuration */
    config: CurrencyConfig;
    /** Whether the amount is rounded to currency's decimal places */
    isRounded: boolean;
}

// =============================================================================
// ROUNDING MODE MAPPING
// =============================================================================

/**
 * Map RoundingMode to PrecisionRoundingMode
 */
function mapRoundingMode(mode: RoundingMode): PrecisionRoundingMode {
    switch (mode) {
        case RoundingMode.ROUND_UP:
            return PrecisionRoundingMode.UP;
        case RoundingMode.ROUND_DOWN:
            return PrecisionRoundingMode.DOWN;
        case RoundingMode.ROUND_CEIL:
            return PrecisionRoundingMode.CEIL;
        case RoundingMode.ROUND_FLOOR:
            return PrecisionRoundingMode.FLOOR;
        case RoundingMode.ROUND_HALF_UP:
            return PrecisionRoundingMode.HALF_UP;
        case RoundingMode.ROUND_HALF_DOWN:
            return PrecisionRoundingMode.HALF_DOWN;
        case RoundingMode.ROUND_HALF_EVEN:
            return PrecisionRoundingMode.HALF_EVEN;
        case RoundingMode.ROUND_HALF_CEIL:
            return PrecisionRoundingMode.HALF_CEIL;
        case RoundingMode.ROUND_HALF_FLOOR:
            return PrecisionRoundingMode.HALF_FLOOR;
        default:
            return DEFAULT_PRECISION_ROUNDING_MODE;
    }
}

// =============================================================================
// CURRENCY-AWARE ROUNDING
// =============================================================================

/**
 * Round a decimal number to specified decimal places
 * Wrapper around preciseRound with RoundingMode support
 */
export function round(
    value: number | string,
    decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): string {
    return preciseRound(value, decimalPlaces, mapRoundingMode(mode));
}

/**
 * Round a value for a specific currency using its standard decimal places
 */
export function roundForCurrency(
    value: number | string,
    currency: string,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): string {
    const decimalPlaces = getCurrencyDecimalPlaces(currency);
    return round(value, decimalPlaces, mode);
}

/**
 * Round a value and track the adjustment made
 * Useful for financial auditing and reconciliation
 */
export function roundWithAdjustment(
    value: number | string,
    decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): RoundingAdjustment {
    const original = parseToString(value);
    const rounded = round(original, decimalPlaces, mode);
    const adjustment = preciseSubtract(rounded, original);

    return {
        original,
        rounded,
        adjustment,
        decimalPlaces,
        roundingMode: mode,
        hasAdjustment: !preciseIsZero(adjustment),
    };
}

/**
 * Round a value for a specific currency and track the adjustment
 */
export function roundForCurrencyWithAdjustment(
    value: number | string,
    currency: string,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): RoundingAdjustment {
    const decimalPlaces = getCurrencyDecimalPlaces(currency);
    return roundWithAdjustment(value, decimalPlaces, mode);
}

// =============================================================================
// CURRENCY CONSTANTS AND FORMATTING
// =============================================================================

export const DEFAULT_CURRENCY_CODE = 'INR';

export function getCurrencySymbol(
    currency: string = DEFAULT_CURRENCY_CODE,
): string {
    const config = getCurrencyConfig(currency);
    return config.symbol || currency.toUpperCase();
}

export function formatMoney(
    amount: number | string,
    currency: string = 'INR',
    locale: string = 'en-IN',
    options?: Intl.NumberFormatOptions,
): string {
    // Use safeToNumber from math utils for safe parsing
    const numericAmount = safeToNumber(amount, 0);

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        ...options,
    }).format(numericAmount);
}

/**
 * Parse money string to number (removes currency symbols and formatting)
 */
export function parseMoney(formattedAmount: string): string {
    // Remove currency symbols, spaces, and commas
    const cleaned = formattedAmount.replace(/[^\d.-]/g, '');
    return parseToString(cleaned);
}

// =============================================================================
// MONEY OBJECT OPERATIONS
// =============================================================================

/**
 * Create a Money object
 */
export function createMoney(
    amount: number | string,
    currency: string = 'INR',
): Money {
    return {
        amount: parseToString(amount),
        currency,
    };
}

/**
 * Add two Money objects (must have same currency)
 */
export function addMoney(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
        throw new Error(
            `Cannot add different currencies: ${a.currency} and ${b.currency}`,
        );
    }

    return {
        amount: preciseAdd(a.amount, b.amount),
        currency: a.currency,
    };
}

/**
 * Subtract two Money objects (must have same currency)
 */
export function subtractMoney(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
        throw new Error(
            `Cannot subtract different currencies: ${a.currency} and ${b.currency}`,
        );
    }

    return {
        amount: preciseSubtract(a.amount, b.amount),
        currency: a.currency,
    };
}

/**
 * Multiply Money by a factor
 */
export function multiplyMoney(money: Money, factor: number | string): Money {
    return {
        amount: preciseMultiply(money.amount, factor),
        currency: money.currency,
    };
}

/**
 * Divide Money by a divisor
 */
export function divideMoney(money: Money, divisor: number | string): Money {
    return {
        amount: preciseDivide(money.amount, divisor),
        currency: money.currency,
    };
}

/**
 * Round Money to specified decimal places
 */
export function roundMoney(
    money: Money,
    decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): Money {
    return {
        amount: round(money.amount, decimalPlaces, mode),
        currency: money.currency,
    };
}

// =============================================================================
// INTEREST CALCULATIONS
// =============================================================================

/**
 * Calculate compound interest
 */
export function compoundInterest(
    principal: number | string,
    rate: number | string,
    time: number,
    frequency: number = 1,
): string {
    const ratePerPeriod = preciseDivide(rate, preciseMultiply(100, frequency));
    const periods = preciseMultiply(time, frequency);

    let result = parseToString(principal);
    const onePlusRate = preciseAdd(1, ratePerPeriod);

    const numPeriods = mathMax(0, mathFloor(toNumber(periods)));
    for (let i = 0; i < numPeriods; i++) {
        result = preciseMultiply(result, onePlusRate);
    }

    return preciseSubtract(result, principal);
}

/**
 * Calculate simple interest
 */
export function simpleInterest(
    principal: number | string,
    rate: number | string,
    time: number | string,
): string {
    return preciseDivide(preciseMultiply(preciseMultiply(principal, rate), time), 100);
}

// =============================================================================
// CURRENCY UNIT CONVERSIONS
// =============================================================================

/**
 * Convert amount to smallest currency unit (e.g., rupees to paise)
 */
export function toSmallestUnit(
    amount: number | string,
    decimals: number = 2,
): string {
    const multiplier = mathPow(10, decimals);
    return preciseRound(preciseMultiply(amount, multiplier), 0);
}

/**
 * Convert amount from smallest currency unit (e.g., paise to rupees)
 */
export function fromSmallestUnit(
    amount: number | string,
    decimals: number = 2,
): string {
    const divisor = mathPow(10, decimals);
    return preciseDivide(amount, divisor);
}

// =============================================================================
// CURRENCY NUMBER HELPER FUNCTIONS
// =============================================================================

/**
 * Round a number to currency precision, optionally with direction
 * @param value - Value to round
 * @param currencyOrDirection - Currency code or direction ('UP', 'DOWN')
 * @param direction - Direction when currencyOrDirection is currency code
 */
export function roundCurrencyNumber(
    value: number | string,
    currencyOrDirection: string = DEFAULT_CURRENCY_CODE,
    direction?: 'UP' | 'DOWN',
): number {
    // Determine if first param is direction or currency
    let currency = DEFAULT_CURRENCY_CODE;
    let roundDir = direction;

    if (currencyOrDirection === 'UP' || currencyOrDirection === 'DOWN') {
        roundDir = currencyOrDirection;
    } else {
        currency = currencyOrDirection;
    }

    const decimalPlaces = getCurrencyDecimalPlaces(currency);
    let mode = DEFAULT_ROUNDING_MODE;

    if (roundDir === 'UP') {
        mode = RoundingMode.ROUND_CEIL;
    } else if (roundDir === 'DOWN') {
        mode = RoundingMode.ROUND_FLOOR;
    }

    return toNumber(round(parseToString(value), decimalPlaces, mode));
}

/**
 * Divide two numbers with currency precision
 */
export function divideMoneyNumbers(
    a: number | string,
    b: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    // Use mathIsZero from math utils for numeric zero check
    if (mathIsZero(safeToNumber(b, 0))) {
        return 0; // Avoid division by zero
    }
    return roundCurrencyNumber(
        preciseDivide(parseToString(a), parseToString(b)),
        currency,
    );
}

/**
 * Calculate what percentage 'part' is of 'whole'
 * e.g., percentOfNumber(25, 100) = 25 (25 is 25% of 100)
 */
export function percentOfNumber(
    part: number | string,
    whole: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    const wholeNum = safeToNumber(whole, 0);
    // Use mathIsZero from math utils for numeric zero check
    if (mathIsZero(wholeNum)) {
        return 0;
    }
    // (part / whole) * 100
    return roundCurrencyNumber(
        preciseMultiply(preciseDivide(parseToString(part), parseToString(whole)), '100'),
        currency,
    );
}

export function addMoneyNumbers(
    values: Array<number | string> = [],
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    if (!values?.length) {
        return 0;
    }

    const total = values.reduce<string>(
        (acc, current) => preciseAdd(acc, parseToString(current)),
        '0',
    );
    return roundCurrencyNumber(total, currency);
}

export function subtractMoneyNumbers(
    minuend: number | string,
    subtrahend: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return roundCurrencyNumber(
        preciseSubtract(parseToString(minuend), parseToString(subtrahend)),
        currency,
    );
}

export function multiplyMoneyNumbers(
    a: number | string,
    b: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return roundCurrencyNumber(
        preciseMultiply(parseToString(a), parseToString(b)),
        currency,
    );
}

export function percentageNumber(
    base: number | string,
    rate: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return roundCurrencyNumber(
        precisePercentage(parseToString(base), parseToString(rate)),
        currency,
    );
}

/**
 * Calculate percentage of a value (alias for percentageNumber)
 * Returns: (base * rate) / 100
 * 
 * @example
 * percentage(1000, 18);  // 180 (18% of 1000)
 * percentage(250, 15);   // 37.5 (15% of 250)
 */
export function percentage(
    base: number | string,
    rate: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return percentageNumber(base, rate, currency);
}

/**
 * Subtract a percentage from a value
 * Returns: base - (base * rate / 100)
 * 
 * @example
 * subtractPercentage(1000, 10);  // 900 (subtract 10%)
 */
export function subtractPercentage(
    base: number | string,
    rate: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return roundCurrencyNumber(
        preciseSubtractPercentage(parseToString(base), parseToString(rate)),
        currency,
    );
}

/**
 * Add a percentage to a value
 * Returns: base + (base * rate / 100)
 * 
 * @example
 * addPercentage(1000, 10);  // 1100 (add 10%)
 */
export function addPercentage(
    base: number | string,
    rate: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return roundCurrencyNumber(
        preciseAddPercentage(parseToString(base), parseToString(rate)),
        currency,
    );
}

export function subtractMoneyList(
    initial: number,
    values: number[],
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return values.reduce(
        (acc, value) => subtractMoneyNumbers(acc, value, currency),
        initial,
    );
}

export function calculateLedgerTotal(
    entries?:
        | Array<{
              amount?: number;
              type?: string;
              isActive?: boolean;
          }>
        | null,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    if (!entries?.length) {
        return 0;
    }

    const contributions = entries.map((entry) => {
        if (!entry?.isActive) {
            return 0;
        }
        const amount = entry.amount || 0;
        return entry.type === 'CREDIT' ? amount : -amount;
    });

    return addMoneyNumbers(contributions, currency);
}

// =============================================================================
// ROUNDING ADJUSTMENT FUNCTIONS
// =============================================================================

/**
 * Calculate the total rounding adjustment from multiple values
 */
export function calculateTotalAdjustment(
    values: (number | string)[],
    decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): {
    originalTotal: string;
    roundedTotal: string;
    perItemAdjustments: RoundingAdjustment[];
    totalAdjustment: string;
    adjustmentFromRoundingSum: string;
} {
    const perItemAdjustments = values.map((v) =>
        roundWithAdjustment(v, decimalPlaces, mode),
    );

    const originalTotal = preciseSum(...values);
    const roundedItemsSum = preciseSum(...perItemAdjustments.map((a) => a.rounded));
    const roundedTotal = round(originalTotal, decimalPlaces, mode);

    // Adjustment from rounding the sum vs summing the rounded values
    const adjustmentFromRoundingSum = preciseSubtract(roundedTotal, roundedItemsSum);

    // Total adjustment from original to rounded
    const totalAdjustment = preciseSubtract(roundedTotal, originalTotal);

    return {
        originalTotal,
        roundedTotal,
        perItemAdjustments,
        totalAdjustment,
        adjustmentFromRoundingSum,
    };
}

/**
 * Distribute rounding adjustment across multiple line items
 * Ensures the sum of rounded items equals the rounded total
 */
export function distributeRoundingAdjustment(
    values: (number | string)[],
    targetTotal: number | string,
    decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
): string[] {
    if (values.length === 0) {
        return [];
    }

    // Round each value
    const roundedValues = values.map((v) => round(v, decimalPlaces));
    const currentSum = preciseSum(...roundedValues);

    // Calculate the difference
    let difference = preciseSubtract(parseToString(targetTotal), currentSum);

    if (preciseIsZero(difference)) {
        return roundedValues;
    }

    // Distribute the difference across items
    const result = [...roundedValues];
    const increment = preciseGreaterThan(difference, '0')
        ? '0.' + '0'.repeat(decimalPlaces - 1) + '1'
        : '-0.' + '0'.repeat(decimalPlaces - 1) + '1';

    let index = 0;
    while (!preciseIsZero(difference) && index < result.length * 10) {
        // Safety limit
        const itemIndex = index % result.length;
        result[itemIndex] = preciseAdd(result[itemIndex], increment);
        difference = preciseSubtract(difference, increment);
        index++;
    }

    return result;
}

// =============================================================================
// CURRENCY-AWARE MONEY OPERATIONS
// =============================================================================

/**
 * Create a currency-aware Money object with validation
 */
export function createCurrencyMoney(
    amount: number | string,
    currency: string,
    autoRound: boolean = true,
): CurrencyMoney {
    const config = getCurrencyConfig(currency);
    const amountStr = parseToString(amount);

    const roundedAmount = autoRound
        ? round(amountStr, config.decimalPlaces)
        : amountStr;

    return {
        amount: roundedAmount,
        currency: config.code,
        config,
        isRounded: autoRound,
    };
}

/**
 * Add two CurrencyMoney objects with validation
 */
export function addCurrencyMoney(
    a: CurrencyMoney,
    b: CurrencyMoney,
): CurrencyMoney {
    if (a.currency !== b.currency) {
        throw new Error(
            `Cannot add different currencies: ${a.currency} and ${b.currency}`,
        );
    }

    const result = preciseAdd(a.amount, b.amount);
    return createCurrencyMoney(result, a.currency, a.isRounded || b.isRounded);
}

/**
 * Round Money object to its currency's standard decimal places
 */
export function roundMoneyToCurrency(
    money: Money,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): Money {
    const decimalPlaces = getCurrencyDecimalPlaces(money.currency);
    return {
        amount: round(money.amount, decimalPlaces, mode),
        currency: money.currency,
    };
}

/**
 * Round Money and get the adjustment
 */
export function roundMoneyWithAdjustment(
    money: Money,
    mode: RoundingMode = DEFAULT_ROUNDING_MODE,
): { money: Money; adjustment: RoundingAdjustment } {
    const decimalPlaces = getCurrencyDecimalPlaces(money.currency);
    const adjustment = roundWithAdjustment(money.amount, decimalPlaces, mode);

    return {
        money: {
            amount: adjustment.rounded,
            currency: money.currency,
        },
        adjustment,
    };
}

// =============================================================================
// FINANCIAL CALCULATION HELPERS
// =============================================================================

/**
 * Calculate tax amount (exclusive tax)
 */
export function calculateTax(
    baseAmount: number | string,
    taxRate: number | string,
    currency: string = 'INR',
): { taxAmount: string; totalWithTax: string } {
    const taxAmount = roundForCurrency(
        precisePercentage(baseAmount, taxRate),
        currency,
    );
    const totalWithTax = preciseAdd(baseAmount, taxAmount);

    return {
        taxAmount,
        totalWithTax: roundForCurrency(totalWithTax, currency),
    };
}

/**
 * Calculate GST (Goods and Services Tax) with CGST and SGST split
 */
export function calculateGST(
    baseAmount: number | string,
    gstRate: number | string,
    currency: string = 'INR',
): {
    gstAmount: string;
    cgst: string;
    sgst: string;
    totalWithGST: string;
} {
    const halfRate = preciseDivide(parseToString(gstRate), '2');
    const cgst = roundForCurrency(precisePercentage(baseAmount, halfRate), currency);
    const sgst = roundForCurrency(precisePercentage(baseAmount, halfRate), currency);
    const gstAmount = preciseAdd(cgst, sgst);
    const totalWithGST = preciseAdd(baseAmount, gstAmount);

    return {
        gstAmount,
        cgst,
        sgst,
        totalWithGST: roundForCurrency(totalWithGST, currency),
    };
}

/**
 * Reverse calculate base amount from total with tax (tax-inclusive pricing)
 */
export function calculateBaseFromTaxInclusive(
    totalAmount: number | string,
    taxRate: number | string,
    currency: string = 'INR',
): { baseAmount: string; taxAmount: string } {
    // Base = Total / (1 + taxRate/100)
    const divisor = preciseAdd('1', preciseDivide(parseToString(taxRate), '100'));
    const baseAmount = roundForCurrency(
        preciseDivide(parseToString(totalAmount), divisor),
        currency,
    );
    const taxAmount = preciseSubtract(parseToString(totalAmount), baseAmount);

    return {
        baseAmount,
        taxAmount: roundForCurrency(taxAmount, currency),
    };
}

/**
 * Calculate discount with proper rounding
 */
export function calculateDiscount(
    originalAmount: number | string,
    discountPercent: number | string | undefined,
    discountAmount: number | string | undefined,
    currency: string = 'INR',
): {
    discountAmount: string;
    finalAmount: string;
    effectiveDiscountPercent: string;
} {
    let calculatedDiscount: string;

    if (
        discountPercent !== undefined &&
        !preciseIsZero(parseToString(discountPercent))
    ) {
        calculatedDiscount = precisePercentage(originalAmount, discountPercent);
    } else if (discountAmount !== undefined) {
        calculatedDiscount = parseToString(discountAmount);
    } else {
        calculatedDiscount = '0';
    }

    // Round the discount
    calculatedDiscount = roundForCurrency(calculatedDiscount, currency);

    // Ensure discount doesn't exceed original amount
    if (preciseGreaterThan(calculatedDiscount, parseToString(originalAmount))) {
        calculatedDiscount = parseToString(originalAmount);
    }

    const finalAmount = roundForCurrency(
        preciseSubtract(parseToString(originalAmount), calculatedDiscount),
        currency,
    );

    // Calculate effective discount percentage
    const effectiveDiscountPercent = preciseIsZero(parseToString(originalAmount))
        ? '0'
        : round(
              precisePercentageOf(calculatedDiscount, parseToString(originalAmount)),
              2,
          );

    return {
        discountAmount: calculatedDiscount,
        finalAmount,
        effectiveDiscountPercent,
    };
}

/**
 * Calculate commission and related deductions (TDS, GST on commission)
 */
export function calculateCommission(
    grossAmount: number | string,
    commissionRate: number | string,
    tdsRate: number | string = '10',
    gstOnCommissionRate: number | string = '18',
    currency: string = 'INR',
): {
    commission: string;
    gstOnCommission: string;
    tds: string;
    netCommission: string;
    netToProperty: string;
} {
    const commission = roundForCurrency(
        precisePercentage(grossAmount, commissionRate),
        currency,
    );
    const gstOnCommission = roundForCurrency(
        precisePercentage(commission, gstOnCommissionRate),
        currency,
    );
    const tds = roundForCurrency(precisePercentage(commission, tdsRate), currency);

    // Net commission = Commission + GST on Commission - TDS
    const netCommission = roundForCurrency(
        preciseSubtract(preciseAdd(commission, gstOnCommission), tds),
        currency,
    );

    // Net to property = Gross - Commission - GST on Commission + TDS
    const netToProperty = roundForCurrency(
        preciseAdd(
            preciseSubtract(
                parseToString(grossAmount),
                preciseAdd(commission, gstOnCommission),
            ),
            tds,
        ),
        currency,
    );

    return {
        commission,
        gstOnCommission,
        tds,
        netCommission,
        netToProperty,
    };
}

// =============================================================================
// INVOICE LINE ITEM CALCULATION (with Rounding Adjustment Tracking)
// =============================================================================

/**
 * Input for line item calculation
 */
export interface LineItemInput {
    /** Unit price (before tax) */
    unitPrice: number | string;
    /** Quantity (must be >= 1) */
    quantity: number;
    /** Discount amount (flat discount, not percentage) */
    discountAmount?: number | string;
    /** Tax rate percentage (0-100) */
    taxRate: number | string;
    /** Currency code */
    currency?: string;
}

/**
 * Result of line item calculation with full audit trail
 */
export interface LineItemResult {
    /** Input values (sanitized) */
    input: {
        unitPrice: string;
        quantity: number;
        discountAmount: string;
        taxRate: string;
    };
    /** Calculated values (all rounded to currency precision) */
    calculated: {
        /** Gross amount = unitPrice × quantity */
        grossAmount: string;
        /** Taxable amount = grossAmount - discountAmount */
        taxableAmount: string;
        /** Tax amount = taxableAmount × (taxRate / 100) */
        taxAmount: string;
        /** Total = taxableAmount + taxAmount */
        total: string;
    };
    /** Rounding adjustment (always 0 in derived mode) */
    roundingAdjustment: string;
    /** Currency used */
    currency: string;
    /** Decimal places used */
    decimalPlaces: number;
}

/**
 * Result of line item calculation for "entered total" mode
 * When user enters the total and we back-calculate the unit price
 */
export interface EnteredTotalLineItemResult extends LineItemResult {
    /** The exact (unrounded) unit price that would give the entered total */
    exactUnitPrice: string;
    /** The displayed unit price (rounded) */
    displayedUnitPrice: string;
    /** The recomputed total using displayed unit price */
    recomputedTotal: string;
    /** Adjustment needed to match entered total */
    roundingAdjustment: string;
    /** Whether adjustment was needed */
    hasAdjustment: boolean;
}

/**
 * Invoice aggregation result
 */
export interface InvoiceAggregation {
    /** Sum of all taxable amounts */
    totalTaxable: string;
    /** Sum of all tax amounts */
    totalTax: string;
    /** Sum of all line item totals (before adjustment) */
    totalBeforeAdjustment: string;
    /** Sum of all rounding adjustments */
    totalAdjustment: string;
    /** Grand total = totalBeforeAdjustment + totalAdjustment */
    grandTotal: string;
    /** Number of line items */
    itemCount: number;
    /** Whether any adjustments were made */
    hasAdjustments: boolean;
    /** Per-item breakdown */
    items: LineItemResult[];
    /** Currency used */
    currency: string;
}

/**
 * Validate and clamp input values for line item calculation
 */
export function validateLineItemInput(input: LineItemInput): {
    unitPrice: string;
    quantity: number;
    discountAmount: string;
    taxRate: string;
    currency: string;
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Parse and validate unit price
    let unitPrice = safeParsePreciseString(input.unitPrice, '0');
    if (preciseIsNegative(unitPrice)) {
        errors.push('Unit price cannot be negative');
        unitPrice = '0';
    }

    // Validate quantity (must be >= 1, use mathClamp and mathFloor for numeric clamping)
    const rawQuantity = mathFloor(safeToNumber(input.quantity, 1));
    const quantity = mathClamp(rawQuantity, 1, Number.MAX_SAFE_INTEGER);
    if (input.quantity < 1) {
        errors.push('Quantity must be at least 1');
    }

    // Validate and clamp discount (cannot be negative)
    let discountAmount = safeParsePreciseString(input.discountAmount, '0');
    if (preciseIsNegative(discountAmount)) {
        errors.push('Discount cannot be negative');
    }
    discountAmount = preciseClamp(discountAmount, '0', preciseMax(discountAmount, '0')); // Ensure non-negative

    // Validate and clamp tax rate (0-100)
    let taxRate = safeParsePreciseString(input.taxRate, '0');
    if (preciseIsNegative(taxRate)) {
        errors.push('Tax rate cannot be negative');
    }
    if (preciseGreaterThan(taxRate, '100')) {
        errors.push('Tax rate cannot exceed 100%');
    }
    taxRate = preciseClamp(taxRate, '0', '100'); // Clamp to valid range

    const currency = input.currency || 'INR';

    return {
        unitPrice,
        quantity,
        discountAmount,
        taxRate,
        currency,
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Calculate line item in DERIVED MODE
 *
 * When price, quantity, and tax are known, calculate:
 * - Gross Amount = Price × Quantity
 * - Taxable Amount = Gross Amount - Discount
 * - Tax Amount = Taxable × (Tax Rate / 100)
 * - Total = Taxable + Tax
 * - Adjustment = 0 (no adjustment in derived mode)
 *
 * All values are rounded at each step to prevent floating-point accumulation.
 */
export function calculateLineItem(input: LineItemInput): LineItemResult {
    const validated = validateLineItemInput(input);
    const { unitPrice, quantity, discountAmount, taxRate, currency } =
        validated;
    const decimalPlaces = getCurrencyDecimalPlaces(currency);

    // Step 1: Calculate gross amount = unitPrice × quantity (rounded)
    const grossAmount = roundForCurrency(
        preciseMultiply(unitPrice, quantity.toString()),
        currency,
    );

    // Step 2: Calculate taxable amount = grossAmount - discount (rounded)
    // Ensure discount doesn't exceed gross amount
    const effectiveDiscount = preciseGreaterThan(discountAmount, grossAmount)
        ? grossAmount
        : discountAmount;
    const taxableAmount = roundForCurrency(
        preciseSubtract(grossAmount, effectiveDiscount),
        currency,
    );

    // Step 3: Calculate tax amount = taxable × (taxRate / 100) (rounded)
    const taxAmount = roundForCurrency(
        precisePercentage(taxableAmount, taxRate),
        currency,
    );

    // Step 4: Calculate total = taxable + tax (rounded)
    const total = roundForCurrency(preciseAdd(taxableAmount, taxAmount), currency);

    return {
        input: {
            unitPrice,
            quantity,
            discountAmount: effectiveDiscount,
            taxRate,
        },
        calculated: {
            grossAmount,
            taxableAmount,
            taxAmount,
            total,
        },
        roundingAdjustment: '0', // No adjustment in derived mode
        currency,
        decimalPlaces,
    };
}

/**
 * Calculate line item in ENTERED TOTAL MODE
 *
 * When total is entered manually, back-solve the unit price:
 * - Exact Price = ((Total / (1 + Tax Rate / 100)) + Discount) / Quantity
 * - Displayed Price = round(Exact Price)
 * - Recompute total from rounded price
 * - Adjustment = Entered Total - Recomputed Total
 *
 * The adjustment ensures the displayed total matches the entered total.
 */
export function calculateLineItemFromTotal(
    enteredTotal: number | string,
    quantity: number,
    taxRate: number | string,
    discountAmount: number | string = '0',
    currency: string = 'INR',
): EnteredTotalLineItemResult {
    const decimalPlaces = getCurrencyDecimalPlaces(currency);
    const total = roundForCurrency(enteredTotal, currency);
    const discount = safeParsePreciseString(discountAmount, '0');
    const tax = safeParsePreciseString(taxRate, '0');
    // Use mathMax and mathFloor from math utils for numeric quantity clamping
    const qty = mathMax(1, mathFloor(safeToNumber(quantity, 1)));

    // Step 1: Back-calculate the taxable amount from total
    // Total = Taxable × (1 + taxRate/100)
    // Taxable = Total / (1 + taxRate/100)
    const taxMultiplier = preciseAdd('1', preciseDivide(tax, '100'));
    const taxableAmount = roundForCurrency(
        preciseDivide(total, taxMultiplier),
        currency,
    );

    // Step 2: Back-calculate gross amount (before discount)
    // Taxable = Gross - Discount
    // Gross = Taxable + Discount
    const grossAmount = roundForCurrency(
        preciseAdd(taxableAmount, discount),
        currency,
    );

    // Step 3: Calculate exact unit price
    // Gross = UnitPrice × Quantity
    // UnitPrice = Gross / Quantity
    const exactUnitPrice = preciseDivide(grossAmount, qty.toString(), 10); // Keep 10 decimal places for precision
    const displayedUnitPrice = roundForCurrency(exactUnitPrice, currency);

    // Step 4: Recompute total using displayed (rounded) unit price
    const recomputedResult = calculateLineItem({
        unitPrice: displayedUnitPrice,
        quantity: qty,
        discountAmount: discount,
        taxRate: tax,
        currency,
    });

    // Step 5: Calculate adjustment
    const recomputedTotal = recomputedResult.calculated.total;
    const adjustment = preciseSubtract(total, recomputedTotal);
    const hasAdjustment = !preciseIsZero(adjustment);

    return {
        input: {
            unitPrice: displayedUnitPrice,
            quantity: qty,
            discountAmount: discount,
            taxRate: tax,
        },
        calculated: {
            grossAmount: recomputedResult.calculated.grossAmount,
            taxableAmount: recomputedResult.calculated.taxableAmount,
            taxAmount: recomputedResult.calculated.taxAmount,
            total: total, // Use the entered total, not recomputed
        },
        exactUnitPrice,
        displayedUnitPrice,
        recomputedTotal,
        roundingAdjustment: adjustment,
        hasAdjustment,
        currency,
        decimalPlaces,
    };
}

/**
 * Aggregate multiple line items for invoice totals
 *
 * Computes sums for Taxable, Tax, and Adjustment separately.
 * Grand Total = Σ(Taxable + Tax) + Σ(Adjustment)
 *
 * This guarantees that the grand total always equals the sum of displayed line-item totals.
 */
export function aggregateLineItems(
    items: LineItemResult[],
    currency: string = 'INR',
): InvoiceAggregation {
    if (items.length === 0) {
        return {
            totalTaxable: '0',
            totalTax: '0',
            totalBeforeAdjustment: '0',
            totalAdjustment: '0',
            grandTotal: '0',
            itemCount: 0,
            hasAdjustments: false,
            items: [],
            currency,
        };
    }

    // Sum all taxable amounts
    const totalTaxable = roundForCurrency(
        preciseSum(...items.map((item) => item.calculated.taxableAmount)),
        currency,
    );

    // Sum all tax amounts
    const totalTax = roundForCurrency(
        preciseSum(...items.map((item) => item.calculated.taxAmount)),
        currency,
    );

    // Sum all line item totals (before adjustment)
    const totalBeforeAdjustment = roundForCurrency(
        preciseAdd(totalTaxable, totalTax),
        currency,
    );

    // Sum all adjustments
    const totalAdjustment = preciseSum(
        ...items.map((item) => item.roundingAdjustment),
    );

    // Grand total = total before adjustment + total adjustment
    const grandTotal = roundForCurrency(
        preciseAdd(totalBeforeAdjustment, totalAdjustment),
        currency,
    );

    // Also verify that grand total equals sum of line item totals
    const sumOfLineTotals = roundForCurrency(
        preciseSum(...items.map((item) => item.calculated.total)),
        currency,
    );

    // If there's a mismatch (due to rounding), add the difference to adjustment
    let finalAdjustment = totalAdjustment;
    if (!preciseEquals(grandTotal, sumOfLineTotals)) {
        const additionalAdjustment = preciseSubtract(sumOfLineTotals, grandTotal);
        finalAdjustment = preciseAdd(totalAdjustment, additionalAdjustment);
    }

    const hasAdjustments = !preciseIsZero(finalAdjustment);

    return {
        totalTaxable,
        totalTax,
        totalBeforeAdjustment,
        totalAdjustment: roundForCurrency(finalAdjustment, currency),
        grandTotal: sumOfLineTotals, // Use sum of line totals as grand total
        itemCount: items.length,
        hasAdjustments,
        items,
        currency,
    };
}

/**
 * Verify invoice mathematical integrity
 *
 * Checks that:
 * 1. Each line item total = taxable + tax + adjustment
 * 2. Grand total = sum of line item totals
 * 3. All values are rounded to currency precision
 */
export function verifyInvoiceIntegrity(aggregation: InvoiceAggregation): {
    isValid: boolean;
    errors: string[];
    details: {
        expectedGrandTotal: string;
        actualGrandTotal: string;
        difference: string;
    };
} {
    const errors: string[] = [];
    const currency = aggregation.currency;

    // Verify each line item
    for (let i = 0; i < aggregation.items.length; i++) {
        const item = aggregation.items[i];
        const expectedTotal = roundForCurrency(
            preciseAdd(
                preciseAdd(item.calculated.taxableAmount, item.calculated.taxAmount),
                item.roundingAdjustment,
            ),
            currency,
        );

        if (!preciseEquals(item.calculated.total, expectedTotal)) {
            errors.push(
                `Line item ${i + 1}: total (${item.calculated.total}) ≠ taxable + tax + adjustment (${expectedTotal})`,
            );
        }
    }

    // Verify grand total
    const expectedGrandTotal = roundForCurrency(
        preciseSum(...aggregation.items.map((item) => item.calculated.total)),
        currency,
    );

    if (!preciseEquals(aggregation.grandTotal, expectedGrandTotal)) {
        errors.push(
            `Grand total (${aggregation.grandTotal}) ≠ sum of line totals (${expectedGrandTotal})`,
        );
    }

    const difference = preciseSubtract(aggregation.grandTotal, expectedGrandTotal);

    return {
        isValid: errors.length === 0,
        errors,
        details: {
            expectedGrandTotal,
            actualGrandTotal: aggregation.grandTotal,
            difference,
        },
    };
}

/**
 * Split tax into CGST and SGST (Indian GST)
 * Handles odd tax amounts by giving extra paisa to CGST
 */
export function splitTaxCGSTSGST(
    taxAmount: number | string,
    currency: string = 'INR',
): { cgst: string; sgst: string } {
    const tax = parseToString(taxAmount);
    const half = preciseDivide(tax, '2');
    const cgst = roundForCurrency(half, currency);
    const sgst = roundForCurrency(preciseSubtract(tax, cgst), currency); // SGST gets remainder

    return { cgst, sgst };
}

/**
 * Calculate round-off amount for invoice
 * Used when rounding invoice total to nearest whole number
 */
export function calculateRoundOff(
    amount: number | string,
    roundTo: 'NEAREST' | 'UP' | 'DOWN' = 'NEAREST',
): { roundedAmount: string; roundOffAmount: string } {
    const originalAmount = parseToString(amount);
    let roundedAmount: string;

    switch (roundTo) {
        case 'UP':
            roundedAmount = round(originalAmount, 0, RoundingMode.ROUND_CEIL);
            break;
        case 'DOWN':
            roundedAmount = round(originalAmount, 0, RoundingMode.ROUND_FLOOR);
            break;
        case 'NEAREST':
        default:
            roundedAmount = round(
                originalAmount,
                0,
                RoundingMode.ROUND_HALF_UP,
            );
            break;
    }

    const roundOffAmount = preciseSubtract(roundedAmount, originalAmount);

    return {
        roundedAmount,
        roundOffAmount,
    };
}

/**
 * Calculate percentage of total (part / total * 100)
 * Commonly used for occupancy rates, distribution percentages, etc.
 * Returns 0 if total is 0 to avoid division by zero.
 *
 * @example
 * calculatePercentageOfTotal(25, 100) // 25
 * calculatePercentageOfTotal(3, 12)   // 25
 * calculatePercentageOfTotal(0, 100)  // 0
 * calculatePercentageOfTotal(50, 0)   // 0 (safe division by zero)
 */
export function calculatePercentageOfTotal(
    part: number | string,
    total: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    const totalNum = safeToNumber(total, 0);
    // Use mathIsZero from math utils for numeric zero check
    if (mathIsZero(totalNum)) return 0;
    return toNumber(preciseMultiply(preciseDivide(part, total), '100'));
}

/**
 * Apply price multiplier to a price amount
 * Used for applying booking engine price adjustments
 *
 * @example
 * applyPriceMultiplier(1000, 1.1)  // 1100 (10% markup)
 * applyPriceMultiplier(1000, 0.9)  // 900 (10% discount)
 */
export function applyPriceMultiplier(
    price: number | string,
    multiplier: number | string,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    return roundCurrencyNumber(preciseMultiply(price, multiplier), currency);
}

/**
 * Calculate discount amount from a total based on discount configuration
 * Handles both percentage-based and fixed amount discounts.
 *
 * @param totalAmount - The base amount to apply discount to
 * @param discount - Discount object with either 'value' (percentage) or 'amount' (fixed)
 * @param currency - Currency code for rounding (default: INR)
 * @returns The calculated discount amount
 *
 * @example
 * calculateDiscountAmount(1000, { value: 10 })    // 100 (10%)
 * calculateDiscountAmount(1000, { amount: 50 })   // 50 (fixed)
 * calculateDiscountAmount(1000, null)             // 0
 */
export function calculateDiscountAmount(
    totalAmount: number | string,
    discount: { value?: number; amount?: number; isActive?: boolean } | null | undefined,
    currency: string = DEFAULT_CURRENCY_CODE,
): number {
    if (!discount) return 0;

    if (discount.value && discount.value > 0) {
        return percentageNumber(totalAmount, discount.value, currency);
    }

    if (discount.amount && discount.amount > 0) {
        return roundCurrencyNumber(discount.amount, currency);
    }

    return 0;
}
