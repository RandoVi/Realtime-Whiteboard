import type  { Arrow } from '../shapes/Arrow'
import type { Circle } from '../shapes/Circle'
import type { Laser } from '../shapes/Laser'
import type { Rectangle } from '../shapes/Rectangle'
import type { Stroke } from '../shapes/Stroke'
import type { Textbox } from '../shapes/Textbox'
import type { Triangle } from '../shapes/Triangle'

export type Object =
    | Rectangle
    | Stroke
    | Circle
    | Triangle
    | Laser
    | Arrow
    | Textbox

export type Point = {
  x: number
  y: number
}

