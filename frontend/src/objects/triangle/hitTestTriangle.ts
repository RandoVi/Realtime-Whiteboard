import type { Point } from "@common/types";
import type { Triangle } from "@common/shapes";

export function hitTestTriangle(
    point: Point,
    triangle: Triangle
): boolean {

    let { x, y, width, height } = triangle

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    const centerX = x + width / 2
    const centerY = y + height / 2

    const dx = point.x - centerX
    const dy = point.y - centerY

    const cos = Math.cos(-triangle.rotation)
    const sin = Math.sin(-triangle.rotation)

    const localX =
        dx * cos - dy * sin

    const localY =
        dx * sin + dy * cos

    const left = -width / 2
    const right = width / 2
    const top = -height / 2
    const bottom = height / 2

    // First check the triangle's bounding box.
    if (
        localX < left ||
        localX > right ||
        localY < top ||
        localY > bottom
    ) {
        return false
    }

    // Convert to triangle vertices.
    const topPoint = {
        x: 0,
        y: top,
    }

    const leftPoint = {
        x: left,
        y: bottom,
    }

    const rightPoint = {
        x: right,
        y: bottom,
    }

    return pointInTriangle(
        { x: localX, y: localY },
        topPoint,
        leftPoint,
        rightPoint,
    )
}

function pointInTriangle(
    point: Point,
    a: Point,
    b: Point,
    c: Point,
): boolean {

    const sign = (
        p1: Point,
        p2: Point,
        p3: Point,
    ) =>
        (p1.x - p3.x) * (p2.y - p3.y) -
        (p2.x - p3.x) * (p1.y - p3.y)

    const d1 = sign(point, a, b)
    const d2 = sign(point, b, c)
    const d3 = sign(point, c, a)

    const hasNegative =
        d1 < 0 || d2 < 0 || d3 < 0

    const hasPositive =
        d1 > 0 || d2 > 0 || d3 > 0

    return !(hasNegative && hasPositive)
}
// 1.world mouse point
//         
// 2.translate relative to triangle center
//         
// 3.rotate point by -rotation
//         
// 4.point is now in triangle's local coordinates
//        
// 5.normal triangle hit test