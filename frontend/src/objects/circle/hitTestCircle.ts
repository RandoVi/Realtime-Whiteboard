import type { Point } from "@common/types";
import type { Circle } from "@common/shapes";

export function hitTestCircle(
    point: Point,
    circle: Circle
): boolean {
    const dx = point.x - circle.x;
    const dy = point.y - circle.y;

    const distanceSquared =
        dx * dx + dy * dy;

    const hitRadius =
        circle.radius + circle.strokeWidth / 2;

    const hit = distanceSquared <= hitRadius * hitRadius;

    console.log("CIRCLE HIT TEST", {
        point,
        center: {
            x: circle.x,
            y: circle.y,
        },
        radius: hitRadius,
        distanceSquared,
        hit,
    });

    return hit;
}
