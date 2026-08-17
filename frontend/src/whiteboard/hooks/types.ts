
import type { RefObject } from "react"
import type { Camera } from "../../camera/Camera"
import type { Tool } from "../../types/Tool"
import type { Editor } from "../../editor/Editor"
import type { Laser } from "@common/shapes/Laser"
import type { RemotePresence } from "../../network/presence/RemotePresence"
import type { ObjectStyle } from "../../objects/ObjectStyle"


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
    remotePresence: Map<string, RemotePresence>;
    localLasers: Laser[];
}