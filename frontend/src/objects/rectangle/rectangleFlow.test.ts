import { expect, it } from "vitest";
import { createObject } from "../createObject";
import { updatePreviewObject } from "../updatePreviewObject";
import { normalizeObject } from "../normalizeObject";
import { hitTestObject } from "../hitTestObject";

it("normalizes a backwards drag into a selectable rectangle", () => {
    const start = { x: 100, y: 100 };
    const preview = createObject("rectangle", start, {
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
    });

    if (!preview || preview.type !== "rectangle") {
        throw new Error("Rectangle creation failed");
    }

    updatePreviewObject(preview, start, { x: 40, y: 60 }, false);
    const rectangle = normalizeObject(preview);

    expect(rectangle).toMatchObject({
        type: "rectangle",
        x: 40,
        y: 60,
        width: 60,
        height: 40,
    });
    expect(hitTestObject({ x: 50, y: 70 }, rectangle)).toBe(true);
    expect(hitTestObject({ x: 120, y: 120 }, rectangle)).toBe(false);
});