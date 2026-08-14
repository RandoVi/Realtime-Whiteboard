import type { Camera } from '../types/Types'
import type { Point } from "@common/types";


export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 10
export const ZOOM_SENSITIVITY = 0.0015

export function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

export function screenToWorld(screen: Point, camera: Camera): Point {
  return {
    x: (screen.x - camera.offsetX) / camera.scale,
    y: (screen.y - camera.offsetY) / camera.scale,
  }
}

export function worldToScreen(world: Point, camera: Camera): Point {
  return {
    x: world.x * camera.scale + camera.offsetX,
    y: world.y * camera.scale + camera.offsetY,
  }
}

export function zoomAtPoint(
  camera: Camera,
  pointer: Point,
  worldBeforeZoom: Point,
  zoomFactor: number
): Camera {
  const nextScale = clampZoom(camera.scale * zoomFactor)

  return {
    scale: nextScale,
    offsetX: pointer.x - worldBeforeZoom.x * nextScale,
    offsetY: pointer.y - worldBeforeZoom.y * nextScale,
  }
}