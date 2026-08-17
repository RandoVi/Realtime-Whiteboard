import type { Camera } from "../../camera/Camera"
import type { Arrow } from "@common/shapes"

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

  const left =
    x * camera.scale + camera.offsetX

  const top =
    y * camera.scale + camera.offsetY

  const screenWidth =
    width * camera.scale

  const screenHeight =
    height * camera.scale

  const centerX =
    left + screenWidth / 2

  const centerY =
    top + screenHeight / 2

  const headWidth =
    screenWidth * 0.35

  const shaftHeight =
    screenHeight * 0.35

  context.save()

  context.translate(centerX, centerY)
  context.rotate(arrow.rotation)

  const localLeft =
    -screenWidth / 2

  const localTop =
    -screenHeight / 2

  context.fillStyle = arrow.fill
  context.strokeStyle = arrow.stroke
  context.lineWidth = 2

  context.beginPath()

  context.moveTo(
    localLeft,
    0
  )

  // Top of arrow head
  context.lineTo(
    localLeft + headWidth,
    localTop
  )

  context.lineTo(
    localLeft + headWidth,
    -shaftHeight / 2
  )

  // Top of shaft
  context.lineTo(
    localLeft + screenWidth,
    -shaftHeight / 2
  )

  // Bottom of shaft
  context.lineTo(
    localLeft + screenWidth,
    shaftHeight / 2
  )

  context.lineTo(
    localLeft + headWidth,
    shaftHeight / 2
  )

  // Bottom of arrow head
  context.lineTo(
    localLeft + headWidth,
    localTop + screenHeight
  )

  context.lineTo(
    localLeft,
    0
  )

  context.closePath()

  context.fill()
  context.stroke()

  context.restore()
}