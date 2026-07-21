import type { Camera } from '../types/Types'
import type { Rectangle } from '../shapes/Rectangle'

export function renderRectangle(
  context: CanvasRenderingContext2D,
  rectangle: Rectangle,
  camera: Camera
) {
  const screenX = rectangle.x * camera.scale + camera.offsetX
  const screenY = rectangle.y * camera.scale + camera.offsetY

  const screenWidth = rectangle.width * camera.scale
  const screenHeight = rectangle.height * camera.scale

  context.fillStyle = rectangle.fill
  context.strokeStyle = rectangle.stroke
  context.lineWidth = 2

  context.beginPath()
  context.rect(
    screenX,
    screenY,
    screenWidth,
    screenHeight
  )

  context.fill()
  context.stroke()
}