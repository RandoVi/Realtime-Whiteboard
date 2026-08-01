import type { Camera } from "../types/Types";
import type { Circle } from "../objects/Circle";

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


  context.beginPath()

  context.arc(
    screenX,
    screenY,
    radius,
    0,
    Math.PI * 2
  )

  context.fillStyle = circle.fill
  context.strokeStyle = circle.stroke
  context.lineWidth = 2

  context.fill()
  context.stroke()
}