import type { Point } from "../../types/Types";
import type { PreviewData } from "../../render/renderObjects";

export type RemotePresence = {
    preview?: PreviewData;
    selectedObjectId?: string | null;
    cursor?: Point;
};