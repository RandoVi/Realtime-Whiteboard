import type { MutableRefObject } from "react";
import type { Camera } from "../camera/Camera";
import type { Interaction } from "./Interaction";
import type { Editor } from "../editor/Editor";
import type { Laser } from "@common/shapes/Laser";
import type { BoardObject } from "@common/types";
import type { Presence } from "../network/presence/Presence";
import type { BoardDocument } from "../document/Document";
import type { ObjectStyle } from "../objects/ObjectStyle";
import type { RemotePresence } from "../network/presence/RemotePresence";


export interface CanvasInteractionContext {

    canvas: HTMLCanvasElement;

    cameraRef: MutableRefObject<Camera>;

    interactionRef: MutableRefObject<Interaction>;

    document: BoardDocument;

    editor: Editor;

    presence: Presence;

    requestRender: () => void;

    getSelectedObject: () => BoardObject | undefined;

    selectObject: (id: string | null) => void;

    objectStyle: ObjectStyle;

    remotePresence: Map<string, RemotePresence>;

    localLasers: Laser[];
}