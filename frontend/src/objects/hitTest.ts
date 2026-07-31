import type {Object} from '../types/Object'
import type {Point} from '../types/Types'


//function to check if this world point is inside a shape
export function hitTestObject(point: Point, shape: Object): boolean {
    switch (shape.type) {
        case 'rectangle':
            return (
                point.x >= shape.x &&
                point.x <= shape.x + shape.width &&
                point.y >= shape.y &&
                point.y <= shape.y + shape.height
            )
        // Add cases for other shape types here
        default:
            console.warn(`Unknown shape type: ${shape.type}`)
            return false
    }
}