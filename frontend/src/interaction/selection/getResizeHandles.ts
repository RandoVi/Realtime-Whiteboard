import type { ResizeHandle } from "../../types/selection";
import type { Camera } from "../../camera/Camera";
import type { SelectionBounds } from "./getSelectionBounds";

export type ResizeHandlePosition = {
    type: ResizeHandle;
    x: number;
    y: number;
};

export function getResizeHandles(
    bounds: SelectionBounds,
    camera: Camera,
    handleTypes: ResizeHandle[] = [
        "nw",
        "ne",
        "sw",
        "se",
    ],
): ResizeHandlePosition[] {

    const centerX =
        bounds.center.x * camera.scale +
        camera.offsetX;

    const centerY =
        bounds.center.y * camera.scale +
        camera.offsetY;

    const halfWidth =
        bounds.width * camera.scale / 2;

    const halfHeight =
        bounds.height * camera.scale / 2;

    const rotation =
        bounds.rotation ?? 0;

    const cos =
        Math.cos(rotation);

    const sin =
        Math.sin(rotation);

    function rotate(
        localX: number,
        localY: number,
    ) {
        return {
            x:
                centerX +
                localX * cos -
                localY * sin,

            y:
                centerY +
                localX * sin +
                localY * cos,
        };
    }

    const positions: Record<
        ResizeHandle,
        { x: number; y: number }
    > = {
        nw: rotate(-halfWidth, -halfHeight),
        ne: rotate(halfWidth, -halfHeight),
        sw: rotate(-halfWidth, halfHeight),
        se: rotate(halfWidth, halfHeight),

        w: rotate(-halfWidth, 0),
        e: rotate(halfWidth, 0),
    }

    return handleTypes.map(type => ({
        type,
        ...positions[type],
    }))
}