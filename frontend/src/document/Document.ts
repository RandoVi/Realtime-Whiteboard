import type { MutableRefObject } from "react";
import type { Shape } from "../types/Shape";


export type Document = {
  shapesRef: MutableRefObject<Shape[]>;
};