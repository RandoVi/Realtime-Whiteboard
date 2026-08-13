// import type { Arrow } from "../objects/arrow/Arrow";
import type { Arrow } from "../objects/arrow/Arrow";
import type { Circle } from "../objects/circle/Circle";
import type { Laser } from "../objects/laser/Laser";
import type { Rectangle } from "../objects/rectangle/Rectangle";
import type { Stroke } from "../objects/stroke/Stroke";
import type { Triangle } from "../objects/triangle/Triangle";

export type ObjectUpdate =
    | Partial<Rectangle>
    | Partial<Circle>
    | Partial<Stroke>
    | Partial<Triangle>
    | Partial<Laser>
    | Partial<Arrow>
    // | Partial<Arrow>;
    