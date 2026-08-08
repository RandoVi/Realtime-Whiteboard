import type { MutableRefObject } from "react";
import type { Camera } from "../types/Types";
import type { Interaction } from "./Interaction";
import type { Editor } from "../editor/Editor";
import type { Object } from "../types/Object";
import type { Presence } from "../socket/preview/Presence";
import type { Document } from "../document/Document";
import type { ObjectStyle } from "../objects/ObjectStyle";
import type { RemotePresence } from "../socket/preview/RemotePresence";

export interface CanvasInteractionContext {

    cameraRef: MutableRefObject<Camera>;

    interactionRef: MutableRefObject<Interaction>;

    document: Document;

    editor: Editor;

    presence: Presence; // replace with your real type

    requestRender: () => void;

    getSelectedObject: () => Object | undefined;

    selectObject: (id: string | null) => void;

    objectStyle: ObjectStyle;

    remotePresence: Map<string, RemotePresence>;
}