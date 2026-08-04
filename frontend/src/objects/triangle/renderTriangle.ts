import type { Camera } from '../../types/Types'
import type { Triangle } from './Triangle'

export function renderTriangle(
    context: CanvasRenderingContext2D,
    triangle: Triangle,
    camera: Camera
) {
    let { x, y, width, height } = triangle

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    const left = x * camera.scale + camera.offsetX
    const top = y * camera.scale + camera.offsetY

    const screenWidth = width * camera.scale
    const screenHeight = height * camera.scale

    context.fillStyle = triangle.fill
    context.strokeStyle = triangle.stroke
    context.lineWidth = 2

    context.beginPath()

    context.moveTo(
        left + screenWidth / 2,
        top
    )

    context.lineTo(
        left,
        top + screenHeight
    )

    context.lineTo(
        left + screenWidth,
        top + screenHeight
    )

    context.closePath()

    context.fill()
    context.stroke()
}