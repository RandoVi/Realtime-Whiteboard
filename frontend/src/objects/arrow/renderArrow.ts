import type { Camera } from "../../types/Types"
import type { Arrow } from "./Arrow"

export function renderArrow(
  context: CanvasRenderingContext2D,
  arrow: Arrow,
  camera: Camera
) {
  let { x, y, width, height } = arrow

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

  const centerY = top + screenHeight / 2

  const headWidth = screenWidth * 0.35
  const shaftHeight = screenHeight * 0.35

  context.fillStyle = arrow.fill
  context.strokeStyle = arrow.stroke
  context.lineWidth = 2

  context.beginPath()

  context.moveTo(left, centerY)

  context.lineTo(
    left + headWidth,
    top
  )

  context.lineTo(
    left + headWidth,
    centerY - shaftHeight / 2
  )

  context.lineTo(
    left + screenWidth,
    centerY - shaftHeight / 2
  )

  // Bottom of shaft
  context.lineTo(
    left + screenWidth,
    centerY + shaftHeight / 2
  )

  context.lineTo(
    left + headWidth,
    centerY + shaftHeight / 2
  )

  context.lineTo(
    left + headWidth,
    top + screenHeight
  )

  context.lineTo(left, centerY)

  context.closePath()

  context.fill()
  context.stroke()
}