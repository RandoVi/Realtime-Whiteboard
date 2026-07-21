import { useEffect, useRef, useState } from 'react'
import type { Camera, Point } from './Types'
import { screenToWorld, zoomAtPoint, ZOOM_SENSITIVITY } from './Camera'

type Props = {
  cameraRef: React.RefObject<Camera>
  viewportRef: React.RefObject<{ width: number; height: number; dpr: number }>
  requestRender: () => void
}

export function useWhiteboardInput({
  cameraRef,
  viewportRef,
  requestRender,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [showCoordinates, setShowCoordinates] = useState(false)
  const [mouseWorld, setMouseWorld] = useState<Point | null>(null)

  const mouseScreenRef = useRef<Point>({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const lastPointerRef = useRef<Point>({ x: 0, y: 0 })

  const bindCanvas = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleZoom = (event: WheelEvent) => {
      event.preventDefault()

      const rect = canvas.getBoundingClientRect()

      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      const camera = cameraRef.current

      const worldBeforeZoom = screenToWorld(pointer, camera)
      const zoomFactor = Math.exp(-event.deltaY * ZOOM_SENSITIVITY)

      cameraRef.current = zoomAtPoint(
        camera,
        pointer,
        worldBeforeZoom,
        zoomFactor
      )

      requestRender()

      if (showCoordinates) {
        setMouseWorld(screenToWorld(mouseScreenRef.current, cameraRef.current))
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()

      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      mouseScreenRef.current = pointer

      if (draggingRef.current) {
        const dx = pointer.x - lastPointerRef.current.x
        const dy = pointer.y - lastPointerRef.current.y

        lastPointerRef.current = pointer

        const camera = cameraRef.current
        cameraRef.current = {
          ...camera,
          offsetX: camera.offsetX + dx,
          offsetY: camera.offsetY + dy,
        }

        requestRender()
      }

      if (showCoordinates) {
        setMouseWorld(screenToWorld(pointer, cameraRef.current))
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return

      const rect = canvas.getBoundingClientRect()

      draggingRef.current = true
      lastPointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      canvas.style.cursor = 'grabbing'
    }

    const stopDragging = () => {
      draggingRef.current = false
      canvas.style.cursor = 'grab'
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'm' || event.repeat) return

      setShowCoordinates((v) => !v)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('keydown', handleKeyDown)

    canvas.addEventListener('wheel', handleZoom, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('keydown', handleKeyDown)

      canvas.removeEventListener('wheel', handleZoom)
      canvas.removeEventListener('mousedown', handleMouseDown)
    }
  }, [showCoordinates, cameraRef, requestRender])

  return {
    showCoordinates,
    mouseWorld,
    bindCanvas,
  }
}