import type { Point } from "../types/Types"

export type Stroke = {
  id: string

  type: "stroke"

  points: Point[]

  stroke: string

  strokeWidth: number
}