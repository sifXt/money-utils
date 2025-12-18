/**
 * @sifxt/money-utils - Constants Module
 * Comprehensive currency and rounding configuration for financial calculations
 *
 * @description
 * This module provides:
 * - 9 rounding modes for different financial scenarios
 * - 50+ currency configurations with ISO 4217 compliance
 * - Currency symbols, decimal places, locales, and smallest units
 * - Common tax rates (GST, TDS, TCS)
 * - Precision thresholds for calculations
 *
 * @example
 * ```typescript
 * import { RoundingMode, getCurrencyConfig, CURRENCY_CODES } from '@sifxt/money-utils';
 *
 * // Get currency configuration
 * const inrConfig = getCurrencyConfig('INR');
 * console.log(inrConfig.decimalPlaces); // 2
 * console.log(inrConfig.symbol);        // '₹'
 *
 * // Use rounding modes
 * import { round } from '@sifxt/money-utils';
 * round('2.5', 0, RoundingMode.ROUND_HALF_EVEN); // '2' (Banker's rounding)
 * ```
 *
 * @author Sifat Singh <sifatsingh7059@gmail.com>
 * @license MIT
 */

// =============================================================================
// ROUNDING MODES
// =============================================================================

/**
 * Comprehensive rounding modes for financial calculations
 *
 * @description
 * These rounding modes cover all common financial scenarios:
 * - ROUND_HALF_EVEN (Banker's rounding) - Default, minimizes cumulative error
 * - ROUND_HALF_UP - Standard mathematical rounding
 * - ROUND_CEIL/FLOOR - Always round towards positive/negative infinity
 * - ROUND_UP/DOWN - Round away from/towards zero
 *
 * @example
 * ```typescript
 * import { round, RoundingMode } from '@sifxt/money-utils';
 *
 * round('2.5', 0, RoundingMode.ROUND_HALF_UP);   // '3'
 * round('2.5', 0, RoundingMode.ROUND_HALF_EVEN); // '2' (even)
 * round('3.5', 0, RoundingMode.ROUND_HALF_EVEN); // '4' (even)
 * round('2.3', 0, RoundingMode.ROUND_CEIL);      // '3'
 * round('-2.3', 0, RoundingMode.ROUND_CEIL);     // '-2'
 * ```
 */
export enum RoundingMode {
    /** Round away from zero (1.1 → 2, -1.1 → -2) */
    ROUND_UP = 'ROUND_UP',
    /** Round towards zero (1.9 → 1, -1.9 → -1) */
    ROUND_DOWN = 'ROUND_DOWN',
    /** Round towards positive infinity (1.1 → 2, -1.9 → -1) */
    ROUND_CEIL = 'ROUND_CEIL',
    /** Round towards negative infinity (1.9 → 1, -1.1 → -2) */
    ROUND_FLOOR = 'ROUND_FLOOR',
    /** Round to nearest, ties away from zero - standard rounding (2.5 → 3, -2.5 → -3) */
    ROUND_HALF_UP = 'ROUND_HALF_UP',
    /** Round to nearest, ties towards zero (2.5 → 2, -2.5 → -2) */
    ROUND_HALF_DOWN = 'ROUND_HALF_DOWN',
    /** Round to nearest, ties to even - Banker's rounding, DEFAULT (2.5 → 2, 3.5 → 4) */
    ROUND_HALF_EVEN = 'ROUND_HALF_EVEN',
    /** Round to nearest, ties towards positive infinity (2.5 → 3, -2.5 → -2) */
    ROUND_HALF_CEIL = 'ROUND_HALF_CEIL',
    /** Round to nearest, ties towards negative infinity (2.5 → 2, -2.5 → -3) */
    ROUND_HALF_FLOOR = 'ROUND_HALF_FLOOR',
}

/** Default rounding mode - Banker's rounding (ROUND_HALF_EVEN) */
export const DEFAULT_ROUNDING_MODE = RoundingMode.ROUND_HALF_EVEN;

/** Default decimal places for currency operations */
export const DEFAULT_DECIMAL_PLACES = 2;

// =============================================================================
// CURRENCY CONFIGURATION
// =============================================================================

/**
 * Currency configuration interface
 */
export interface CurrencyConfig {
    /** ISO 4217 currency code */
    code: string;
    /** Currency symbol */
    symbol: string;
    /** Number of decimal places for this currency */
    decimalPlaces: number;
    /** Default locale for formatting */
    locale: string;
    /** Smallest unit name (e.g., 'paise' for INR, 'cents' for USD) */
    smallestUnit: string;
    /** Full currency name */
    name: string;
    /** Rounding mode typically used for this currency */
    roundingMode: RoundingMode;
}

/**
 * Supported currency codes
 */
export const CURRENCY_CODES = {
    // Primary currencies
    INR: 'INR',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',

    // Asia-Pacific
    AUD: 'AUD',
    SGD: 'SGD',
    JPY: 'JPY',
    CNY: 'CNY',
    HKD: 'HKD',
    THB: 'THB',
    MYR: 'MYR',
    IDR: 'IDR',
    PHP: 'PHP',
    VND: 'VND',
    KRW: 'KRW',
    TWD: 'TWD',
    NZD: 'NZD',

    // Middle East
    AED: 'AED',
    SAR: 'SAR',
    QAR: 'QAR',
    KWD: 'KWD',
    BHD: 'BHD',
    OMR: 'OMR',

    // Americas
    CAD: 'CAD',
    MXN: 'MXN',
    BRL: 'BRL',

    // Europe
    CHF: 'CHF',
    SEK: 'SEK',
    NOK: 'NOK',
    DKK: 'DKK',
    PLN: 'PLN',
    CZK: 'CZK',
    RUB: 'RUB',
    TRY: 'TRY',

    // Africa
    ZAR: 'ZAR',
    EGP: 'EGP',
    NGN: 'NGN',
    KES: 'KES',

    // South Asia
    LKR: 'LKR',
    PKR: 'PKR',
    BDT: 'BDT',
    NPR: 'NPR',
    MVR: 'MVR',
} as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[keyof typeof CURRENCY_CODES];

/**
 * Currency symbols map
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    SGD: 'S$',
    JPY: '¥',
    CNY: '¥',
    HKD: 'HK$',
    THB: '฿',
    MYR: 'RM',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    KRW: '₩',
    TWD: 'NT$',
    NZD: 'NZ$',
    AED: 'د.إ',
    SAR: '﷼',
    QAR: '﷼',
    KWD: 'د.ك',
    BHD: '.د.ب',
    OMR: '﷼',
    CAD: 'C$',
    MXN: '$',
    BRL: 'R$',
    CHF: 'CHF',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    RUB: '₽',
    TRY: '₺',
    ZAR: 'R',
    EGP: '£',
    NGN: '₦',
    KES: 'KSh',
    LKR: 'Rs',
    PKR: 'Rs',
    BDT: '৳',
    NPR: 'Rs',
    MVR: 'Rf',
};

/**
 * Currency decimal places (ISO 4217 standard)
 * Most currencies use 2 decimal places, but some are different
 */
export const CURRENCY_DECIMAL_PLACES: Record<string, number> = {
    // 0 decimal places (no minor units)
    JPY: 0,
    KRW: 0,
    VND: 0,
    IDR: 0, // technically 2, but practically 0

    // 3 decimal places
    KWD: 3,
    BHD: 3,
    OMR: 3,

    // 2 decimal places (default for all others)
    INR: 2,
    USD: 2,
    EUR: 2,
    GBP: 2,
    AUD: 2,
    SGD: 2,
    CNY: 2,
    HKD: 2,
    THB: 2,
    MYR: 2,
    PHP: 2,
    TWD: 2,
    NZD: 2,
    AED: 2,
    SAR: 2,
    QAR: 2,
    CAD: 2,
    MXN: 2,
    BRL: 2,
    CHF: 2,
    SEK: 2,
    NOK: 2,
    DKK: 2,
    PLN: 2,
    CZK: 2,
    RUB: 2,
    TRY: 2,
    ZAR: 2,
    EGP: 2,
    NGN: 2,
    KES: 2,
    LKR: 2,
    PKR: 2,
    BDT: 2,
    NPR: 2,
    MVR: 2,
};

/**
 * Currency locales for formatting
 */
export const CURRENCY_LOCALES: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    AUD: 'en-AU',
    SGD: 'en-SG',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    HKD: 'zh-HK',
    THB: 'th-TH',
    MYR: 'ms-MY',
    IDR: 'id-ID',
    PHP: 'en-PH',
    VND: 'vi-VN',
    KRW: 'ko-KR',
    TWD: 'zh-TW',
    NZD: 'en-NZ',
    AED: 'ar-AE',
    SAR: 'ar-SA',
    QAR: 'ar-QA',
    KWD: 'ar-KW',
    BHD: 'ar-BH',
    OMR: 'ar-OM',
    CAD: 'en-CA',
    MXN: 'es-MX',
    BRL: 'pt-BR',
    CHF: 'de-CH',
    SEK: 'sv-SE',
    NOK: 'nb-NO',
    DKK: 'da-DK',
    PLN: 'pl-PL',
    CZK: 'cs-CZ',
    RUB: 'ru-RU',
    TRY: 'tr-TR',
    ZAR: 'en-ZA',
    EGP: 'ar-EG',
    NGN: 'en-NG',
    KES: 'en-KE',
    LKR: 'si-LK',
    PKR: 'ur-PK',
    BDT: 'bn-BD',
    NPR: 'ne-NP',
    MVR: 'dv-MV',
};

/**
 * Smallest unit names for currencies
 */
export const CURRENCY_SMALLEST_UNITS: Record<string, string> = {
    INR: 'paise',
    USD: 'cents',
    EUR: 'cents',
    GBP: 'pence',
    AUD: 'cents',
    SGD: 'cents',
    JPY: 'yen', // no subdivision
    CNY: 'fen',
    HKD: 'cents',
    THB: 'satang',
    MYR: 'sen',
    IDR: 'sen',
    PHP: 'centavo',
    VND: 'xu',
    KRW: 'jeon',
    TWD: 'cents',
    NZD: 'cents',
    AED: 'fils',
    SAR: 'halala',
    QAR: 'dirham',
    KWD: 'fils',
    BHD: 'fils',
    OMR: 'baisa',
    CAD: 'cents',
    MXN: 'centavos',
    BRL: 'centavos',
    CHF: 'rappen',
    SEK: 'öre',
    NOK: 'øre',
    DKK: 'øre',
    PLN: 'grosz',
    CZK: 'haléř',
    RUB: 'kopek',
    TRY: 'kuruş',
    ZAR: 'cents',
    EGP: 'piastres',
    NGN: 'kobo',
    KES: 'cents',
    LKR: 'cents',
    PKR: 'paisa',
    BDT: 'poisha',
    NPR: 'paisa',
    MVR: 'laari',
};

/**
 * Full currency configuration by currency code
 */
export const CURRENCIES: Record<string, CurrencyConfig> = Object.keys(
    CURRENCY_CODES,
).reduce(
    (acc, key) => {
        const code = CURRENCY_CODES[key as keyof typeof CURRENCY_CODES];
        acc[code] = {
            code,
            symbol: CURRENCY_SYMBOLS[code] || code,
            decimalPlaces: CURRENCY_DECIMAL_PLACES[code] ?? 2,
            locale: CURRENCY_LOCALES[code] || 'en-US',
            smallestUnit: CURRENCY_SMALLEST_UNITS[code] || 'cents',
            name: code, // Could be extended with full names
            roundingMode: DEFAULT_ROUNDING_MODE,
        };
        return acc;
    },
    {} as Record<string, CurrencyConfig>,
);

/**
 * Get currency configuration
 */
export function getCurrencyConfig(currencyCode: string): CurrencyConfig {
    const config = CURRENCIES[currencyCode.toUpperCase()];
    if (!config) {
        // Return default configuration for unknown currencies
        return {
            code: currencyCode.toUpperCase(),
            symbol: currencyCode.toUpperCase(),
            decimalPlaces: DEFAULT_DECIMAL_PLACES,
            locale: 'en-US',
            smallestUnit: 'cents',
            name: currencyCode.toUpperCase(),
            roundingMode: DEFAULT_ROUNDING_MODE,
        };
    }
    return config;
}

/**
 * Check if currency code is valid
 */
export function isValidCurrency(currencyCode: string): boolean {
    return currencyCode.toUpperCase() in CURRENCIES;
}

/**
 * Get decimal places for a currency
 */
export function getCurrencyDecimalPlaces(currencyCode: string): number {
    return getCurrencyConfig(currencyCode).decimalPlaces;
}

// =============================================================================
// ROUNDING ADJUSTMENT CONFIGURATION
// =============================================================================

/**
 * Rounding adjustment result interface
 */
export interface RoundingAdjustment {
    /** Original value before rounding */
    original: string;
    /** Rounded value */
    rounded: string;
    /** The adjustment (difference between original and rounded) */
    adjustment: string;
    /** Decimal places used for rounding */
    decimalPlaces: number;
    /** Rounding mode used */
    roundingMode: RoundingMode;
    /** Whether an adjustment was made */
    hasAdjustment: boolean;
}

/**
 * Configuration for automatic rounding in operations
 */
export interface RoundingConfig {
    /** Whether to auto-round results */
    autoRound: boolean;
    /** Decimal places for auto-rounding */
    decimalPlaces: number;
    /** Rounding mode to use */
    mode: RoundingMode;
    /** Whether to track adjustments */
    trackAdjustments: boolean;
}

export const DEFAULT_ROUNDING_CONFIG: RoundingConfig = {
    autoRound: false,
    decimalPlaces: DEFAULT_DECIMAL_PLACES,
    mode: DEFAULT_ROUNDING_MODE,
    trackAdjustments: false,
};

// =============================================================================
// FINANCIAL CONSTANTS
// =============================================================================

/**
 * Common tax rates
 */
export const TAX_RATES = {
    GST: {
        NONE: 0,
        LOW: 5,
        STANDARD: 12,
        HIGH: 18,
        LUXURY: 28,
    },
    TDS: {
        STANDARD: 10,
        REDUCED: 1,
        HIGHER: 20,
    },
    TCS: {
        STANDARD: 0.5,
        HIGHER: 1,
    },
} as const;

/**
 * Precision thresholds
 */
export const PRECISION = {
    /** Default internal calculation precision */
    CALCULATION: 20,
    /** Maximum safe decimal places */
    MAX_DECIMALS: 15,
    /** Epsilon for floating-point comparisons */
    EPSILON: '0.0000000001',
} as const;
