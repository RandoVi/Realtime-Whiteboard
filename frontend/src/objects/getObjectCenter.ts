import type { BoardObject, Point } from "@common/types"

export function getObjectCenter(object: BoardObject): Point {
    switch (object.type) {
        case "circle":
            return {
                x: object.x,
                y: object.y,
            }

        case "rectangle":
        case "triangle":
        case "textbox":
        case "arrow":
            return {
                x: object.x + object.width / 2,
                y: object.y + object.height / 2,
            }

        default:
            throw new Error(
                `Object type "${object.type}" does not have a center`
            )
    }
}