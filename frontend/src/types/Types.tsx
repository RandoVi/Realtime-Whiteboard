import type { Editor } from "../editor/Editor"
import type { Interaction } from "../interaction/Interaction"
import type { Shape } from "./Shape"
import type { Tool } from "./Tool"
import type { RefObject } from "react"
import type { Document } from "../document/Document"

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
  document: Document
  tool: Tool
  editor: Editor
  setSelectedShapeId: React.Dispatch<
    React.SetStateAction<string | null>
  >
  selectedShapeIdRef: React.RefObject<string | null>
}