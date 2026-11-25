import { describe, expect, it } from "vitest";
import type { Stroke } from "@common/shapes";
import { hitTestStroke } from "./hitTestStroke";

const line: Stroke = {
  id: "stroke-1",
  type: "stroke",
  points: [{ x: 0, y: 0 }, { x: 100, y: 0 }],
  stroke: "#000000",
  strokeWidth: 2,
};

describe("hitTestStroke", () => {
  it("selects near a segment but rejects points outside its tolerance", () => {
    expect(hitTestStroke({ x: 50, y: 6 }, line)).toBe(true);
    expect(hitTestStroke({ x: 50, y: 8 }, line)).toBe(false);

    // The same tolerance applies beyond the segment's endpoint.
    expect(hitTestStroke({ x: 104, y: 0 }, line)).toBe(true);
    expect(hitTestStroke({ x: 108, y: 0 }, line)).toBe(false);
  });

  it("handles a stroke containing one point", () => {
    const dot: Stroke = {
      ...line,
      points: [{ x: 10, y: 10 }],
    };

    expect(hitTestStroke({ x: 13, y: 14 }, dot)).toBe(true);
    expect(hitTestStroke({ x: 18, y: 10 }, dot)).toBe(false);
  });

  it("does not select an empty stroke", () => {
    expect(hitTestStroke({ x: 0, y: 0 }, { ...line, points: [] })).toBe(false);
  });
});