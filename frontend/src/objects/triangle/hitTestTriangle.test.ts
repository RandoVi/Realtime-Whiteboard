import { describe, expect, it } from "vitest";
import type { Triangle } from "@common/shapes";
import { hitTestTriangle } from "./hitTestTriangle";

const triangle: Triangle = {
  id: "triangle-1",
  type: "triangle",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  fill: "#ffffff",
  stroke: "#000000",
  strokeWidth: 2,
};

describe("hitTestTriangle", () => {
  it("rejects points inside the bounds but outside the triangle", () => {
    expect(hitTestTriangle({ x: 50, y: 50 }, triangle)).toBe(true);
    expect(hitTestTriangle({ x: 10, y: 10 }, triangle)).toBe(false);
  });

  it("tests points against the rotated triangle", () => {
    const rotated = { ...triangle, rotation: Math.PI / 2 };

    expect(hitTestTriangle({ x: 80, y: 50 }, rotated)).toBe(true);
    expect(hitTestTriangle({ x: 50, y: 10 }, rotated)).toBe(false);
  });
});