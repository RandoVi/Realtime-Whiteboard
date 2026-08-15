import type { Point } from "@common/types"

export function rotatePoint(
    point: Point,
    center: Point,
    angle: number,
): Point {
    const dx = point.x - center.x
    const dy = point.y - center.y

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
    }
}

export function inverseRotatePoint(
    point: Point,
    center: Point,
    angle: number,
): Point {
    return rotatePoint(
        point,
        center,
        -angle,
    )
}