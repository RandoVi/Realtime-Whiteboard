import type {
    Dispatch,
    MutableRefObject,
    SetStateAction,
} from "react"
import type { Point } from "@common/types";
import type { Camera } from "../../camera/Camera";
import { screenToWorld, ZOOM_SENSITIVITY, zoomAtPoint } from "../../camera/Camera"
import type { TextEditorRef } from "../CanvasInteractionContext";


type Args = {
    event: WheelEvent
    canvas: HTMLCanvasElement
    cameraRef: MutableRefObject<Camera>
    textEditorRef: MutableRefObject<TextEditorRef | null>
    requestRender: () => void
    showCoordinates: boolean
    mouseScreenRef: MutableRefObject<Point>
    setMouseWorld: Dispatch<SetStateAction<Point | null>>
}

export function handleZoom({
    event,
    canvas,
    cameraRef,
    textEditorRef,
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

    textEditorRef.current?.update();

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