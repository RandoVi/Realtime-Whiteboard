import type { BoardObject } from "@common/types";

import { objectHandlers } from "./objectHandlers";

export function getObjectHandler(
    object: BoardObject
) {
    return objectHandlers[object.type] as any;
}

export function getObjectHandlerByType(
    type: BoardObject["type"]
) {
    return objectHandlers[type] as any;
}