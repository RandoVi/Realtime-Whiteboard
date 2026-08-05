import type { Editor } from "../editor/Editor"
import type { Interaction } from "../interaction/Interaction"
import type { Tool } from "./Tool"
import type { RefObject } from "react"
import type { Document } from "../document/Document"
import type { ObjectStyle } from "../objects/ObjectStyle"

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
  presence: any
  setSelectedObjectId: React.Dispatch<
    React.SetStateAction<string | null>
  >
  selectedObjectIdRef: React.RefObject<string | null>
  onStartInteraction: () => void;
  objectStyle: ObjectStyle;
}