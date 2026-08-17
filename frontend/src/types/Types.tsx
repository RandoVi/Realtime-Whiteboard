import type { Editor } from "../editor/Editor"
import type { Tool } from "./Tool"
import type { RefObject } from "react"
import type { BoardDocument } from "../document/Document"
import type { ObjectStyle } from "../objects/ObjectStyle"
import type { RemotePresence } from "../network/presence/RemotePresence"
import type { Laser } from "@common/shapes"
import type { Camera } from "../camera/Camera"



export type UseWhiteboardInputProps = {
  cameraRef: RefObject<Camera>
  viewportRef: RefObject<{
    width: number
    height: number
    dpr: number
  }>
  requestRender: () => void
  document: BoardDocument
  tool: Tool
  editor: Editor
  presence: any
  setSelectedObjectId: React.Dispatch<
    React.SetStateAction<string | null>
  >
  selectedObjectIdRef: React.RefObject<string | null>
  onStartInteraction: () => void;
  objectStyle: ObjectStyle;
  remotePresence: Map<string, RemotePresence>;
  localLasers: Laser[];
}