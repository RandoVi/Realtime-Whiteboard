import type { Rectangle } from "@common/shapes"
import type { Point } from "@common/types"

export function hitTestRectangle(
    point: Point,
    rectangle: Rectangle
): boolean {

    const centerX =
        rectangle.x +
        rectangle.width / 2;

    const centerY =
        rectangle.y +
        rectangle.height / 2;

    const dx =
        point.x - centerX;

    const dy =
        point.y - centerY;

    const cos =
        Math.cos(-rectangle.rotation);

    const sin =
        Math.sin(-rectangle.rotation);

    const localX =
        dx * cos -
        dy * sin;

    const localY =
        dx * sin +
        dy * cos;

    const strokePadding =
        rectangle.strokeWidth / 2;

    const x =
        localX +
        rectangle.width / 2;

    const y =
        localY +
        rectangle.height / 2;

    return (
        x >= -strokePadding &&
        x <= rectangle.width + strokePadding &&
        y >= -strokePadding &&
        y <= rectangle.height + strokePadding
    );
}