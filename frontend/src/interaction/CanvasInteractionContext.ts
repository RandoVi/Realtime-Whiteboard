import type { MutableRefObject } from "react";
import type { Camera, Point } from "../types/Types";
import type { Interaction } from "./Interaction";
import type { Editor } from "../editor/Editor";
import type { Object } from "../types/Object";
import type { Presence } from "../socket/preview/Presence";
import type { Document } from "../document/Document";

export interface CanvasInteractionContext {

    cameraRef: MutableRefObject<Camera>;

    interactionRef: MutableRefObject<Interaction>;

    document: Document;

    editor: Editor;

    presence: Presence; // replace with your real type

    requestRender: () => void;

    getSelectedObject: () => Object | undefined;

    selectObject: (id: string | null) => void;
}