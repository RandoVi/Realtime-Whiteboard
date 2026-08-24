import type { Arrow } from '../shapes/Arrow';
import type { Circle } from '../shapes/Circle';
import type { Laser } from '../shapes/Laser';
import type { Rectangle } from '../shapes/Rectangle';
import type { Stroke } from '../shapes/Stroke';
import type { Textbox } from '../shapes/Textbox';
import type { Triangle } from '../shapes/Triangle';
import type { CanvasText } from '../shapes/CanvasText';
export type BoardObject = Rectangle | Stroke | Circle | Triangle | Laser | Arrow | Textbox | CanvasText;
export type RotatableObject = Rectangle | Circle | Triangle | Textbox | Arrow | CanvasText;
export type Point = {
    x: number;
    y: number;
};
//# sourceMappingURL=Object.d.ts.map