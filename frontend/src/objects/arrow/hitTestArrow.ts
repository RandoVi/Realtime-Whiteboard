import type { Point } from "@common/types";
import type { Arrow } from "@common/shapes";
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";

export function hitTestArrow(
    point: Point,
    arrow: Arrow,
): boolean {
    let { x, y, width, height } = arrow;

    if (width < 0) {
        x += width;
        width = Math.abs(width);
    }

    if (height < 0) {
        y += height;
        height = Math.abs(height);
    }

    const center = {
        x: x + width / 2,
        y: y + height / 2,
    };

    const localPoint = inverseRotatePoint(
    point,
    center,
    arrow.rotation,
);

const px = localPoint.x - center.x;
const py = localPoint.y - center.y;

const halfWidth = width / 2;
const halfHeight = height / 2;

const headWidth = width * 0.35;
const shaftHalfHeight = height * 0.35 / 2;

const polygon: Point[] = [
    { x: -halfWidth, y: 0 },
    { x: -halfWidth + headWidth, y: -halfHeight },
    { x: -halfWidth + headWidth, y: -shaftHalfHeight },
    { x: halfWidth, y: -shaftHalfHeight },
    { x: halfWidth, y: shaftHalfHeight },
    { x: -halfWidth + headWidth, y: shaftHalfHeight },
    { x: -halfWidth + headWidth, y: halfHeight },
];

const localPointForTest = {
    x: px,
    y: py,
};

if (isPointInPolygon(localPointForTest, polygon)) {
    return true;
}

return isPointNearPolygon(
    localPointForTest,
    polygon,
    arrow.strokeWidth / 2,
);
}

function isPointInPolygon(
    point: Point,
    polygon: Point[],
): boolean {
    let inside = false;

    for (
        let i = 0, j = polygon.length - 1;
        i < polygon.length;
        j = i++
    ) {
        const a = polygon[i];
        const b = polygon[j];

        const intersects =
            (a.y > point.y) !== (b.y > point.y) &&
            point.x <
                ((b.x - a.x) * (point.y - a.y)) /
                    (b.y - a.y) +
                a.x;

        if (intersects) {
            inside = !inside;
        }
    }

    return inside;
}

function isPointNearPolygon(
    point: Point,
    polygon: Point[],
    distance: number,
): boolean {
    for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % polygon.length];

        if (
            distanceToSegment(point, a, b) <= distance
        ) {
            return true;
        }
    }

    return false;
}

function distanceToSegment(
    point: Point,
    a: Point,
    b: Point,
): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    if (dx === 0 && dy === 0) {
        return Math.hypot(
            point.x - a.x,
            point.y - a.y,
        );
    }

    const t = Math.max(
        0,
        Math.min(
            1,
            (
                (point.x - a.x) * dx +
                (point.y - a.y) * dy
            ) /
            (dx * dx + dy * dy),
        ),
    );

    const closestX = a.x + t * dx;
    const closestY = a.y + t * dy;

    return Math.hypot(
        point.x - closestX,
        point.y - closestY,
    );
}