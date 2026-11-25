import { describe, expect, it } from "vitest";
import type { Rectangle } from "@common/shapes";
import { getTopObjectAtPoint } from "./getTopObjectAtPoint";

describe("getTopObjectAtPoint", () => {
  it("selects the front object without changing the input order", () => {
    const back: Rectangle = {
      id: "back",
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 2,
    };

    const front: Rectangle = {
      ...back,
      id: "front",
      x: 20,
      y: 20,
      width: 50,
      height: 50,
    };

    const objects = [back, front];

    expect(getTopObjectAtPoint(objects, { x: 25, y: 25 })).toBe(front);
    expect(getTopObjectAtPoint(objects, { x: 5, y: 5 })).toBe(back);
    expect(getTopObjectAtPoint(objects, { x: 200, y: 200 })).toBeUndefined();
    expect(objects.map((object) => object.id)).toEqual(["back", "front"]);
  });
});