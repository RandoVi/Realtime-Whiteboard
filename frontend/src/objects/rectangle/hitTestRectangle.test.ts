import { expect, it } from "vitest";
import type { Rectangle } from "@common/shapes";
import { hitTestRectangle } from "./hitTestRectangle";

it("tests points against the rotated rectangle", () => {
    const rectangle: Rectangle = {
        id: "rectangle-1",
        type: "rectangle",
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        rotation: Math.PI / 2,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
    };

    // Rotation makes this point inside the tall, rotated rectangle.
    expect(hitTestRectangle({ x: 50, y: 50 }, rectangle)).toBe(true);

    // This point was inside before rotation but is outside afterward.
    expect(hitTestRectangle({ x: 90, y: 10 }, rectangle)).toBe(false);
});