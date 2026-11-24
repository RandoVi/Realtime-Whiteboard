import type { BoardObject, Point } from "@common/types";
import type { Tool } from "../types/Tool";
import type { ObjectStyle } from "./ObjectStyle";
import { objectHandlers } from "./registry/objectHandlers";
import { getObjectHandlerByType } from "./registry/getObjectHandler";

function isObjectTool(tool: Tool): tool is BoardObject["type"] {
    return Object.prototype.hasOwnProperty.call(objectHandlers, tool);
}

export function createObject(
    tool: Tool,
    point: Point,
    style: ObjectStyle,
): BoardObject | null {
    if (!isObjectTool(tool)) {
        return null;
    }

    return getObjectHandlerByType(tool).create(point, style);
}