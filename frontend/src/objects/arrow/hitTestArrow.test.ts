import { describe, expect, it } from "vitest";
import type { Arrow } from "@common/shapes";
import { hitTestArrow } from "./hitTestArrow";

const arrow: Arrow = {
  id: "arrow-1",
  type: "arrow",
  x: 0,
  y: 0,
  width: 100,
  height: 40,
  rotation: 0,
  fill: "#ffffff",
  stroke: "#000000",
  strokeWidth: 2,
};

describe("hitTestArrow", () => {
  it("uses the arrow outline rather than its bounding box", () => {
    expect(hitTestArrow({ x: 10, y: 20 }, arrow)).toBe(true); // head
    expect(hitTestArrow({ x: 60, y: 20 }, arrow)).toBe(true); // shaft
    expect(hitTestArrow({ x: 10, y: 5 }, arrow)).toBe(false);
    expect(hitTestArrow({ x: 60, y: 5 }, arrow)).toBe(false);
  });

  it("tests points against the rotated arrow", () => {
    const rotated = { ...arrow, rotation: Math.PI / 2 };

    expect(hitTestArrow({ x: 50, y: 60 }, rotated)).toBe(true);
    expect(hitTestArrow({ x: 90, y: 20 }, rotated)).toBe(false);
  });
});