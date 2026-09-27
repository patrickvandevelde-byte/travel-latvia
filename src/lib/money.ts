/**
 * Money is always integer minor units (cents) plus an ISO 4217 currency.
 * Never use floats for amounts (CLAUDE.md, NFR-06).
 */
export type Currency = "EUR";

export type Money = {
  readonly amount: number; // integer minor units
  readonly currency: Currency;
};

export function money(amount: number, currency: Currency = "EUR"): Money {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`Money amount must be an integer number of cents, got ${amount}`);
  }
  return { amount, currency };
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new TypeError(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amount + b.amount, a.currency);
}

export function subtract(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amount - b.amount, a.currency);
}

export function multiply(a: Money, quantity: number): Money {
  if (!Number.isSafeInteger(quantity)) {
    throw new RangeError(`Quantity must be an integer, got ${quantity}`);
  }
  return money(a.amount * quantity, a.currency);
}

export function sum(items: readonly Money[], currency: Currency = "EUR"): Money {
  return items.reduce((total, item) => add(total, item), money(0, currency));
}

/**
 * Percentage of an amount, rounded half-up to the nearest cent.
 * `percent` is a number such as 10 for 10 %.
 */
export function percentOf(a: Money, percent: number): Money {
  if (percent < 0 || percent > 100) {
    throw new RangeError(`Percent must be between 0 and 100, got ${percent}`);
  }
  return money(Math.round((a.amount * percent) / 100), a.currency);
}

export function formatMoney(a: Money, locale = "en-IE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: a.currency,
    minimumFractionDigits: a.amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(a.amount / 100);
}
