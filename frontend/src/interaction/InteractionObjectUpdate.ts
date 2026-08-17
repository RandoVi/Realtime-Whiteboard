
import type { Arrow, Circle, Laser, Rectangle, Stroke, Triangle, Textbox } from "@common/shapes";



export type InteractionObjectUpdate =
    | Partial<Rectangle>
    | Partial<Circle>
    | Partial<Stroke>
    | Partial<Triangle>
    | Partial<Laser>
    | Partial<Arrow>
    | Partial<Textbox>
    