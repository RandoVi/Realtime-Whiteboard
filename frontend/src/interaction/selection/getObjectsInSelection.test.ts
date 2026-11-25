import { describe, expect, it } from "vitest";
import type { Rectangle } from "@common/shapes";
import { getObjectsInSelection } from "./getObjectsInSelection";

const first: Rectangle = {
  id: "first",
  type: "rectangle",
  x: 10,
  y: 10,
  width: 20,
  height: 20,
  rotation: 0,
  fill: "#ffffff",
  stroke: "#000000",
  strokeWidth: 2,
};

describe("getObjectsInSelection", () => {
  it("includes partial overlaps in either drag direction", () => {
    const outside: Rectangle = { ...first, id: "outside", x: 70 };
    const objects = [first, outside];
    const start = { x: 30, y: 15 };
    const end = { x: 50, y: 25 };

    // The selection touches the first rectangle's stroke-padded bounds.
    expect(getObjectsInSelection(objects, start, end)).toEqual([first]);
    expect(getObjectsInSelection(objects, end, start)).toEqual([first]);
    expect(objects).toEqual([first, outside]);
  });

  it("returns no objects when the selection misses them", () => {
    expect(
      getObjectsInSelection([first], { x: 50, y: 50 }, { x: 60, y: 60 }),
    ).toEqual([]);
  });
});