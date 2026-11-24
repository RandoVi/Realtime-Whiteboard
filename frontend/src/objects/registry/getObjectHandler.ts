import type { BoardObject } from "@common/types";
import type { ObjectHandler } from "./ObjectHandler";
import { objectHandlers } from "./objectHandlers";

export function getObjectHandler<T extends BoardObject>(
    object: T
): ObjectHandler<T> {
    return objectHandlers[object.type] as unknown as ObjectHandler<T>;
}

export function getObjectHandlerByType<K extends BoardObject["type"]>(
    type: K
): ObjectHandler<Extract<BoardObject, { type: K }>> {
    return objectHandlers[type] as unknown as ObjectHandler<
        Extract<BoardObject, { type: K }>
    >;
}