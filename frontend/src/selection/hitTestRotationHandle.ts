import type { Point } from "@common/types"
import type { Camera } from "../types/Types"
import type { Object } from "@common/types"
import { getRotationHandle } from "./getRotationHandle"

const ROTATION_HANDLE_SIZE = 12

export function hitTestRotationHandle(
    object: Object,
    pointer: Point,
    camera: Camera,
): boolean {

    const handle = getRotationHandle(
        object,
        camera,
    )

    const dx = pointer.x - handle.x
    const dy = pointer.y - handle.y

    return (
        Math.abs(dx) <= ROTATION_HANDLE_SIZE / 2 &&
        Math.abs(dy) <= ROTATION_HANDLE_SIZE / 2
    )
}