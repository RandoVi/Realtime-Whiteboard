import type { Object } from "@common/types"

export function getObjectById(
  objects: Object[],
  id: string,
): Object | undefined {
  return objects.find(object => object.id === id)
}