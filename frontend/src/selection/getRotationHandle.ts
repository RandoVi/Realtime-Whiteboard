import type { Camera } from "../types/Types"
import type { Object } from "@common/types"
import { getSelectionBounds } from "./getSelectionBounds"

export type RotationHandle = {
    x: number
    y: number
}

const ROTATION_HANDLE_OFFSET = 30

export function getRotationHandle(
    object: Object,
    camera: Camera,
): RotationHandle {

    const bounds = getSelectionBounds(object)

    const centerX =
        bounds.center.x * camera.scale + camera.offsetX

    const centerY =
        bounds.center.y * camera.scale + camera.offsetY

    const halfHeight =
        bounds.height * camera.scale / 2

    const localX = 0
    const localY = -halfHeight - ROTATION_HANDLE_OFFSET

    const rotation = bounds.rotation ?? 0

    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)

    return {
        x: centerX + localX * cos - localY * sin,
        y: centerY + localX * sin + localY * cos,
    }
}