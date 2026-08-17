import type {
    Dispatch,
    MutableRefObject,
    SetStateAction,
} from "react"
import type { Point } from "@common/types";
import type { Camera } from "../../camera/Camera";
import { screenToWorld, ZOOM_SENSITIVITY, zoomAtPoint } from "../../camera/Camera"


type Args = {
    event: WheelEvent
    canvas: HTMLCanvasElement
    cameraRef: MutableRefObject<Camera>
    requestRender: () => void
    showCoordinates: boolean
    mouseScreenRef: MutableRefObject<Point>
    setMouseWorld: Dispatch<SetStateAction<Point | null>>
}

export function handleZoom({
    event,
    canvas,
    cameraRef,
    requestRender,
    showCoordinates,
    mouseScreenRef,
    setMouseWorld,
}: Args) {
    event.preventDefault()

    const rect = canvas.getBoundingClientRect()

    const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }

    const camera = cameraRef.current

    const worldBeforeZoom = screenToWorld(pointer, camera)

    const zoomFactor = Math.exp(
        -event.deltaY * ZOOM_SENSITIVITY
    )

    cameraRef.current = zoomAtPoint(
        camera,
        pointer,
        worldBeforeZoom,
        zoomFactor
    )

    requestRender()

    if (showCoordinates) {
        setMouseWorld(
            screenToWorld(
                mouseScreenRef.current,
                cameraRef.current
            )
        )
    }
}