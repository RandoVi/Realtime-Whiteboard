import type { Object } from '../types/Object'
import type { Point } from '../types/Types'


//function to check if this world point is inside a object
export function hitTestObject(point: Point, object: Object): boolean {
    switch (object.type) {
        case 'rectangle':
            return (
                point.x >= object.x &&
                point.x <= object.x + object.width &&
                point.y >= object.y &&
                point.y <= object.y + object.height
            )

        case "circle": {
            const dx = point.x - object.x
            const dy = point.y - object.y

            const distance = Math.sqrt(
                dx * dx + dy * dy
            )

            return distance <= object.radius
        }
        default:
            console.warn(`Unknown object type: ${object.type}`)
            return false
    }
}