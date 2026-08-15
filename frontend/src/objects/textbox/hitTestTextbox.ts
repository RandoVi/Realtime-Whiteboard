import type { Textbox } from "@common/shapes/Textbox"
import type { Point } from "@common/types";
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";


export function hitTestTextbox(
    point: Point,
    textbox: Textbox
): boolean {

    const center = {
        x: textbox.x + textbox.width / 2,
        y: textbox.y + textbox.height / 2,
    }

    const localPoint = inverseRotatePoint(
        point,
        center,
        textbox.rotation,
    )

    return (
        localPoint.x >= textbox.x &&
        localPoint.x <= textbox.x + textbox.width &&
        localPoint.y >= textbox.y &&
        localPoint.y <= textbox.y + textbox.height
    )
}