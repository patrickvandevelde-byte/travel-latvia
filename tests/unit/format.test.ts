import { describe, expect, it } from "vitest";
import { formatDuration } from "@/lib/format";

describe("formatDuration", () => {
  it("formats minutes, hours and days", () => {
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(180)).toBe("3 h");
    expect(formatDuration(150)).toBe("2 h 30 min");
    expect(formatDuration(2880)).toBe("2 days");
    expect(formatDuration(0)).toBeNull();
    expect(formatDuration(null)).toBeNull();
  });
});
