import type { BoardObject, Point } from "@common/types";
import type { Tool } from "../types/Tool";
import type { ObjectStyle } from "./ObjectStyle";
import type { ObjectHandler } from "./registry/ObjectHandler";
import { objectHandlers } from "./registry/objectHandlers";

export function createObject(
  tool: Tool,
  point: Point,
  style: ObjectStyle,
): BoardObject | null {
  if (!Object.prototype.hasOwnProperty.call(objectHandlers, tool)) {
    return null;
  }

  const handler = objectHandlers[
    tool as keyof typeof objectHandlers
  ] as ObjectHandler;

  return handler.create?.(point, style) ?? null;
}