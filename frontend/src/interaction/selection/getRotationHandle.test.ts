import { expect, it } from "vitest";
import type { Rectangle } from "@common/shapes";
import type { Camera } from "../../camera/Camera";
import { getRotationHandle } from "./getRotationHandle";

it("positions the handle above a zoomed rectangle and rotates it around the center", () => {
    const rectangle: Rectangle = {
        id: "rectangle-1",
        type: "rectangle",
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        rotation: 0,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
    };
    const camera: Camera = {
        scale: 2,
        offsetX: 5,
        offsetY: 7,
    };

    // Rectangle center in screen coordinates: (125, 97).
    // Bounds height includes the 2-unit stroke: 52 units.
    // At 2x zoom, half-height is 52 pixels; the handle is 30 more pixels up. (125, 97 - 52 - 30) = (125, 15)
    expect(getRotationHandle(rectangle, camera)).toEqual({
        x: 125,
        y: 15,
    });

    rectangle.rotation = Math.PI / 2;
    const rotatedHandle = getRotationHandle(rectangle, camera);

    // A 90-degree turn moves that 82-pixel upward offset to the right.
    expect(rotatedHandle.x).toBeCloseTo(207);
    expect(rotatedHandle.y).toBeCloseTo(97);
});