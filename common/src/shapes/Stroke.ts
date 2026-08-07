import type { Point } from "../types/Object";
export type Stroke = {
  id: string

  type: "stroke"

  points: Point[]

  stroke: string

  strokeWidth: number
}