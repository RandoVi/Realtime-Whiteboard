import { describe, expect, it, vi } from "vitest";
import type { CanvasText, Rectangle, Stroke } from "@common/shapes";
import type { Camera } from "../camera/Camera";
import { renderSelection } from "./renderSelection";


// Both renderSelection and getRotationHandle use getSelectionBounds.
// Give them predictable bounds so these tests focus on which handles
// are drawn, rather than on text measurement or shape geometry.
vi.mock("../interaction/selection/getSelectionBounds", () => ({
    getSelectionBounds: () => ({
        left: 0,
        top: 0,
        right: 100,
        bottom: 50,
        width: 100,
        height: 50,
        center: { x: 50, y: 25 },
        rotation: 0,
    }),
}));

// Scale 1 and zero offsets keep world and screen positions aligned.
const camera: Camera = { scale: 1, offsetX: 0, offsetY: 0 };

function makeContext() {
    // Each mock records calls instead of drawing on a real canvas.
    // strokeRect draws the selection box; rect draws resize handles.
    // arc is used for the rotation handle and its icon.
    return {
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        beginPath: vi.fn(),
        rect: vi.fn(),
        strokeRect: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
    };
}

describe("renderSelection", () => {
    it("keeps text selection and resize handles without a rotation handle", () => {
        const text: CanvasText = {
            id: "text-1",
            type: "text",
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            rotation: 0,
            text: "Hello",
            fontSize: 20,
            fontFamily: "Arial",
            fontWeight: 400,
            fill: "#000000",
        };
        const context = makeContext();

        renderSelection(
            // The mock implements only the canvas methods this function uses.
            context as unknown as CanvasRenderingContext2D,
            text,
            camera,
            "#000000",
        );
        // Text has four corner resize handles and a rotation handle.
        expect(context.strokeRect).toHaveBeenCalledOnce();
        expect(context.rect).toHaveBeenCalledTimes(4);
        expect(context.arc).toHaveBeenCalled();
    });

    it("shows a rotation handle for a rectangle", () => {
        const rectangle: Rectangle = {
            id: "rectangle-1",
            type: "rectangle",
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            rotation: 0,
            fill: "#ffffff",
            stroke: "#000000",
            strokeWidth: 2,
        };
        const context = makeContext();

        renderSelection(
            context as unknown as CanvasRenderingContext2D,
            rectangle,
            camera,
            "#000000",
        );

        // The rectangle retains its selection box.
        expect(context.strokeRect).toHaveBeenCalledOnce();

        // At least one arc means the rotation handle was drawn.
        expect(context.arc).toHaveBeenCalled();
    });
});

//  these tests verify which canvas drawing operations happen.
//  Because bounds are mocked, they do not check whether the 
// handles appear at the correct coordinates.


it("draws only the selection box when handles are hidden", () => {
    const rectangle: Rectangle = {
        id: "rectangle-2",
        type: "rectangle",
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        rotation: 0,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
    };
    const context = makeContext();

    renderSelection(
        context as unknown as CanvasRenderingContext2D,
        rectangle,
        camera,
        "#000000",
        false, // showHandles
    );

    expect(context.strokeRect).toHaveBeenCalledOnce();
    expect(context.rect).not.toHaveBeenCalled();
    expect(context.arc).not.toHaveBeenCalled();
});


it("shows a stroke selection box without resize or rotation handles", () => {
    const stroke: Stroke = {
        id: "stroke-1",
        type: "stroke",
        points: [{ x: 0, y: 0 }, { x: 100, y: 50 }],
        stroke: "#000000",
        strokeWidth: 2,
    };
    const context = makeContext();

    renderSelection(
        context as unknown as CanvasRenderingContext2D,
        stroke,
        camera,
        "#000000",
    );

    expect(context.strokeRect).toHaveBeenCalledOnce();
    expect(context.rect).not.toHaveBeenCalled();
    expect(context.arc).not.toHaveBeenCalled();
});