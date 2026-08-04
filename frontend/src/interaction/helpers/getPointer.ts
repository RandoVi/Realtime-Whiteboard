import type { Point } from "../../types/Types";

export function getPointer(
    event: MouseEvent,
    canvas: HTMLCanvasElement
): Point {
    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}