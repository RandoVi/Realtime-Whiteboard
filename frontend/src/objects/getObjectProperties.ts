import type { BoardObject } from "@common/types";

import {
    getObjectHandler,
    getObjectHandlerByType,
} from "./registry/getObjectHandler";

import type { ObjectProperty } from "./properties/ObjectProperty";

export function getObjectProperties(
    object: BoardObject
): ObjectProperty[] {
    return getObjectHandler(object).properties ?? [];
}

export function getObjectPropertiesForType(
    type: BoardObject["type"]
): ObjectProperty[] {
    return getObjectHandlerByType(type).properties ?? [];
}