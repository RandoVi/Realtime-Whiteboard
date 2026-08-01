import type { Circle } from '../objects/Circle'
import type { Rectangle } from '../objects/Rectangle'
import type { Stroke } from '../objects/Stroke'

export type Object =
    | Rectangle
    | Stroke
    | Circle

