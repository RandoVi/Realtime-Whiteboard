import { expect, it, vi } from "vitest";
import type { BoardObject } from "@common/types";
import type { Rectangle, CanvasText } from "@common/shapes";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import type { Camera } from "../../camera/Camera";
import { getRotationHandle } from "../selection/getRotationHandle";
import { handleSelectMouseDown } from "./handleSelectMouseDown";

// Keep resize behavior out of this test so it checks the rotation decision.
vi.mock("../resizing/beginResize", () => ({
    beginResize: () => false,
}));

const camera: Camera = { scale: 1, offsetX: 0, offsetY: 0 };

function makeContext(object: BoardObject) {
    const editorExecute = vi.fn();

    const context = {
        cameraRef: { current: camera },
        interactionRef: { current: { type: "idle" } },
        getSelectedObject: () => object,
        document: { objectsRef: { current: [] } },
        editor: { execute: editorExecute },
        requestRender: vi.fn(),
        selectedObjectIdRef: { current: object.id },
        setSelectedObjectId: vi.fn(),
        selectedObjectIdsRef: { current: [object.id] },
        setSelectedObjectIds: vi.fn(),
        selectObject: vi.fn(),
    } as unknown as CanvasInteractionContext;

    return { context, editorExecute };
}

it("rotates a rectangle and rotates canvas text", () => {
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

    const pointer = getRotationHandle(rectangle, camera);
    const rectangleCase = makeContext(rectangle);

    handleSelectMouseDown({
        pointer,
        world: { x: 0, y: 0 },
        context: rectangleCase.context,
        multiSelect: false,
    });

    expect(rectangleCase.context.interactionRef.current.type).toBe("rotating");
    expect(rectangleCase.editorExecute).toHaveBeenCalledWith({
        type: "bringBoardObjectToFront",
        boardObjectId: rectangle.id,
    });

    const textCase = makeContext(text);

    handleSelectMouseDown({
        pointer: getRotationHandle(text, camera),
        world: { x: 0, y: 0 },
        context: textCase.context,
        multiSelect: false,
    });

    expect(textCase.context.interactionRef.current.type).toBe("rotating");
    expect(textCase.editorExecute).toHaveBeenCalledWith({
        type: "bringBoardObjectToFront",
        boardObjectId: text.id,
    });
});