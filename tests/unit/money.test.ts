import { describe, expect, it } from "vitest";
import { add, formatMoney, money, multiply, percentOf, subtract, sum } from "@/lib/money";

describe("money", () => {
  it("rejects fractional cents", () => {
    expect(() => money(10.5)).toThrow(RangeError);
  });

  it("adds, subtracts and multiplies in cents", () => {
    expect(add(money(4500), money(2250)).amount).toBe(6750);
    expect(subtract(money(4500), money(500)).amount).toBe(4000);
    expect(multiply(money(3900), 3).amount).toBe(11700);
    expect(sum([money(100), money(250), money(5)]).amount).toBe(355);
  });

  it("rounds percentages half-up to the cent", () => {
    expect(percentOf(money(4999), 10).amount).toBe(500);
    expect(percentOf(money(1005), 50).amount).toBe(503);
    expect(() => percentOf(money(100), 120)).toThrow(RangeError);
  });

  it("formats euros without trailing zeros for whole amounts", () => {
    expect(formatMoney(money(4500))).toBe("€45");
    expect(formatMoney(money(4550))).toBe("€45.50");
  });
});
