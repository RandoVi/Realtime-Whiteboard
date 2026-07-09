import type {Camera, Point} from '../Types'
import type { Rectangle } from '../shapes/Rectangle'
import { HANDLE_SIZE, type ResizeHandle } from './selection'

export function hitTestHandle(point: Point, rectangle: Rectangle, camera: Camera): ResizeHandle | null {
    // Convert world coordinates to screen coordinates
    const screenX = rectangle.x * camera.scale + camera.offsetX
    const screenY = rectangle.y * camera.scale + camera.offsetY

    const screenWidth = rectangle.width * camera.scale
    const screenHeight = rectangle.height * camera.scale
    
    const handles: { type: ResizeHandle; x: number; y: number }[] = [
        { type: 'nw', x: screenX, y: screenY },
        { type: 'ne', x: screenX + screenWidth, y: screenY },
        { type: 'sw', x: screenX, y: screenY + screenHeight },
        { type: 'se', x: screenX + screenWidth, y: screenY + screenHeight },
    ] as const

    for (const handle of handles) {
    if (
        point.x >= handle.x - HANDLE_SIZE / 2 &&
        point.x <= handle.x + HANDLE_SIZE / 2 &&
        point.y >= handle.y - HANDLE_SIZE / 2 &&
        point.y <= handle.y + HANDLE_SIZE / 2
    ) {
        return console.log(`Hit test for handle ${handle.type} at (${handle.x}, ${handle.y})`), handle.type
    }
    }

    return null

}