import type { Shape } from "../types/Shape";
import type { Document } from "./Document";


export function createDocument(
  shapes: Shape[]
): Document {

  return {
    shapesRef: {
      current: shapes,
    },
  };

}