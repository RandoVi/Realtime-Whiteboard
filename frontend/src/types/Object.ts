// import type { Arrow } from '../objects/arrow/Arrow'
import type { Circle } from '../objects/circle/Circle'
import type { Rectangle } from '../objects/rectangle/Rectangle'
import type { Stroke } from '../objects/stroke/Stroke'
import type { Triangle } from '../objects/triangle/Triangle'

export type Object =
    | Rectangle
    | Stroke
    | Circle
    | Triangle
    // | Arrow

