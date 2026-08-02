import type { Object } from '../types/Object'
import type { Point } from '../types/Types'
import { hitTestCircle } from './circle/hitTestCircle'
import { hitTestRectangle } from './rectangle/hitTestRectangle'


//function to check if this world point is inside a object
export function hitTestObject(point: Point, object: Object): boolean {
    switch (object.type) {
        case 'rectangle':
            return hitTestRectangle(point, object)

        case "circle": {
            return hitTestCircle(point, object)
        }
        default:
            console.warn(`Unknown object type: ${object.type}`)
            return false
    }
}