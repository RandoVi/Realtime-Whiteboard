import type { Interaction } from "./interaction/Interaction"
import type { Shape } from "./shapes/Shape"
import type { Tool } from "./tools/Tool"
import type { RefObject } from "react"

export type Point = {
  x: number
  y: number
}

export type Camera = {
  scale: number
  offsetX: number
  offsetY: number
}

export type UseWhiteboardInputResult = {
  showCoordinates: boolean
  mouseWorld: Point | null
  bindCanvas: (canvas: HTMLCanvasElement | null) => void
  interactionRef: React.RefObject<Interaction>
}

export type UseWhiteboardInputProps = {
  cameraRef: RefObject<Camera>
  viewportRef: RefObject<{
    width: number
    height: number
    dpr: number
  }>
  requestRender: () => void
  shapesRef: RefObject<Shape[]>
  tool: Tool
  
  setSelectedShapeId: React.Dispatch<
    React.SetStateAction<string | null>
  >
  selectedShapeIdRef: React.RefObject<string | null>
}