import type { Point } from "../types/Types";
import type { CanvasInteractionContext } from "./CanvasInteractionContext";
import { getTopObjectAtPoint } from "../objects/getTopObjectAtPoint";
import { startTextboxEditing } from "./textEditing/startTextboxEditing";

type Args = {
    world: Point;
    context: CanvasInteractionContext;
};

export function handleDoubleClick({
    world,
    context,
}: Args) {

    const {
        document,
        interactionRef,
    } = context;

    const object = getTopObjectAtPoint(
        document.objectsRef.current,
        world,
    );

    if (!object) {
        return;
    }

    if (object.type !== "textbox") {
        return;
    }

    startTextboxEditing({
        textbox: object,
        context,
    });
}