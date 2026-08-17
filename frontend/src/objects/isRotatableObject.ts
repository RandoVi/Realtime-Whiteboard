import type { BoardObject, RotatableObject } from "@common/types"

export function isRotatableObject(
    object: BoardObject
): object is RotatableObject {
    return (
        object.type === "rectangle" ||
        object.type === "circle" ||
        object.type === "triangle" ||
        object.type === "textbox" ||
        object.type === "arrow"
    )
}