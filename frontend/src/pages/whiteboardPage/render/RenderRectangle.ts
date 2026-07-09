import type { Camera } from '../Types'
import type { Rectangle } from '../shapes/Rectangle'
import { HANDLE_SIZE } from '../tools/selection'

export function renderRectangle(context: CanvasRenderingContext2D, rectangle: Rectangle, camera: Camera, isSelected: boolean) {
    // Convert world coordinates to screen coordinates
    const screenX = rectangle.x * camera.scale + camera.offsetX
    const screenY = rectangle.y * camera.scale + camera.offsetY

    const screenWidth = rectangle.width * camera.scale
    const screenHeight = rectangle.height * camera.scale

    context.fillStyle = rectangle.fill
    context.strokeStyle = rectangle.stroke
    context.lineWidth = 2

    context.beginPath()
    // Draw the rectangle using screen coordinates and scaled dimensions
    context.rect(screenX, screenY, screenWidth, screenHeight)
    context.fill()
    context.stroke()

    if (isSelected) {
        context.save()

        context.strokeStyle = '#3b82f6'
        context.lineWidth = 2

        const padding = 2

        context.strokeRect(
        screenX - padding,
        screenY - padding,
        screenWidth + padding * 2,
        screenHeight + padding * 2,
        )

        context.restore()

        context.fillStyle = "white"
        context.strokeStyle = "#3b82f6"
        const handles = [
            { x: screenX, y: screenY },
            { x: screenX + screenWidth, y: screenY },
            { x: screenX, y: screenY + screenHeight },
            { x: screenX + screenWidth, y: screenY + screenHeight },
        ]
        for (const handle of handles) {
        context.beginPath()

        context.rect(
            handle.x - HANDLE_SIZE / 2,
            handle.y - HANDLE_SIZE / 2,
            HANDLE_SIZE,
            HANDLE_SIZE
        )

        context.fill()
        context.stroke()
        }
    }



    
}