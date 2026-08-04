import type { Circle } from "./Circle";

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