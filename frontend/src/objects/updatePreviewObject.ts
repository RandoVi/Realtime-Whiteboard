import type { Object } from '../types/Object'
import type { Point } from '../types/Types'
import { updateCirclePreview } from './circle/updateCirclePreview';
import { updateRectanglePreview } from './rectangle/updateRectanglePreview';
import { updateStrokePreview } from './stroke/updateStrokePreview';

export function updatePreviewObject(
    object: Object,
    start: Point,
    current: Point,
) {
    switch (object.type) {
        case "rectangle":
            updateRectanglePreview(object, start, current);
            break;

        case "circle":
            updateCirclePreview(object, start, current);
            break;

        case "stroke":
            updateStrokePreview(object, current);
            break;
    }
}