import type { Stroke } from "./Stroke"

export function duplicateStroke(
    stroke: Stroke
): Stroke {
    return {
        ...stroke,
        id: crypto.randomUUID(),
        points: stroke.points.map(point => ({
            x: point.x + 20,
            y: point.y + 20,
        })),
    };
}
