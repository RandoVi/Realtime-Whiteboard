import type { MutableRefObject } from "react";
import type { Camera } from "../types/Types";
import type { Interaction } from "./Interaction";
import type { Editor } from "../editor/Editor";
import type { Object } from "../types/Object";
import type { Presence } from "../socket/preview/Presence";
import type { Document } from "../document/Document";
import type { ObjectStyle } from "../objects/ObjectStyle";
import type { RemotePresence } from "../socket/preview/RemotePresence";
import type { Laser } from "../objects/laser/Laser";

export interface CanvasInteractionContext {

    canvas: HTMLCanvasElement;

    cameraRef: MutableRefObject<Camera>;

    interactionRef: MutableRefObject<Interaction>;

    document: Document;

    editor: Editor;

    presence: Presence;

    requestRender: () => void;

    getSelectedObject: () => Object | undefined;

    selectObject: (id: string | null) => void;

    objectStyle: ObjectStyle;

    remotePresence: Map<string, RemotePresence>;

    localLasers: Laser[];
}