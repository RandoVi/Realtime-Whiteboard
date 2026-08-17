import type { Point } from "@common/types";
import type { Laser } from "@common/shapes";
import type { PreviewData } from "../../rendering/renderObjects";

export type RemotePresence = {
    preview?: PreviewData;

    selectedObjectId?: string | null;

    cursor?: Point;

    lasers: Laser[];
};