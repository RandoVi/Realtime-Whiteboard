import type { Camera } from "../../camera/Camera"
import type { Circle } from "@common/shapes"

export function renderCircle(
  context: CanvasRenderingContext2D,
  circle: Circle,
  camera: Camera
) {
  const screenX =
    circle.x * camera.scale + camera.offsetX

  const screenY =
    circle.y * camera.scale + camera.offsetY

  const radius =
    circle.radius * camera.scale

  context.save()

  context.translate(screenX, screenY)
  context.rotate(circle.rotation)

  context.beginPath()

  context.arc(
    0,
    0,
    radius,
    0,
    Math.PI * 2
  )

  context.fillStyle = circle.fill
  context.strokeStyle = circle.stroke
  context.lineWidth = 2

  context.fill()
  context.stroke()

  context.restore()
}