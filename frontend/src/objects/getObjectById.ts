import type { Object } from "../types/Object"

export function getObjectById(
  objects: Object[],
  id: string,
): Object | undefined {
  return objects.find(object => object.id === id)
}