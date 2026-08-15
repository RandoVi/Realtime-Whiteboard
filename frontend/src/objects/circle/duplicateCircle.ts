import type { Circle } from "@common/shapes"

export function duplicateCircle(
  circle: Circle
): Circle {
            return {
                ...circle,
                id: crypto.randomUUID(),
                x: circle.x + 20,
                y: circle.y + 20,
            };

}