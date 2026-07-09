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
}

// export type Props = {
//   cameraRef: React.RefObject<Camera>
//   viewportRef: React.RefObject<{ width: number; height: number; dpr: number }>
//   requestRender: () => void
//   shapesRef: React.RefObject<Shape[]>
//   tool: Tool
// }

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
  selectedShapeId: string | null
  setSelectedShapeId: React.Dispatch<
    React.SetStateAction<string | null>
  >
  selectedShapeIdRef: React.RefObject<string | null>
}