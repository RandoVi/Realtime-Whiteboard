import type { BoardObject } from "@common/types"

export function getObjectById(
  objects: BoardObject[],
  id: string,
): BoardObject | undefined {
  return objects.find(object => object.id === id)
}