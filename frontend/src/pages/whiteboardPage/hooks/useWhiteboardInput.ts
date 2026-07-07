import { useEffect, useRef, useState } from 'react'
import type { Camera, Point } from '../Types'
import { screenToWorld, zoomAtPoint, ZOOM_SENSITIVITY } from '../Camera'
import type { UseWhiteboardInputProps } from '../Types'
import type { Shape } from '../shapes/Shape'
import { normalizeRectangle } from '../shapes/geometry/normalizeRectangle'
import { hitTestShape } from '../shapes/hitTest'

export function useWhiteboardInput({
  cameraRef,
  viewportRef,
  requestRender,
  shapesRef,
  tool,
  selectedShapeId,
  setSelectedShapeId,
}: UseWhiteboardInputProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [showCoordinates, setShowCoordinates] = useState(false)
  const [mouseWorld, setMouseWorld] = useState<Point | null>(null)

  const mouseScreenRef = useRef<Point>({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const lastPointerRef = useRef<Point>({ x: 0, y: 0 })

// drawing state
  const drawingRef = useRef(false)
  const startPointRef = useRef<Point | null>(null)
  const previewShapeRef = useRef<Shape | null>(null)

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
      // Update the mouse position in screen coordinates, aka screen space
      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      if (
        tool === 'rectangle' &&
        drawingRef.current &&
        startPointRef.current &&
        previewShapeRef.current
      ) {
        const world = screenToWorld(pointer, cameraRef.current)

        previewShapeRef.current = {
          ...previewShapeRef.current,

          width: world.x - startPointRef.current.x,
          height: world.y - startPointRef.current.y,
        }

        requestRender()
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

      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      if (tool === "select") {

        const world = screenToWorld(
          pointer,
          cameraRef.current
        )

        const clickedShape = shapesRef.current
          .slice()
          .reverse()
          .find(shape =>
            hitTestShape(world, shape)
          )

        if (clickedShape) {
          setSelectedShapeId(clickedShape.id)
        } else {
          setSelectedShapeId(null)
        }

        requestRender()
        return
      }
      

      if (tool === 'pan') {
        draggingRef.current = true
        lastPointerRef.current = pointer

        canvas.style.cursor = 'grabbing'
        return
      }
      
      if (tool === 'rectangle') {
        const world = screenToWorld(pointer, cameraRef.current)

        drawingRef.current = true
        startPointRef.current = world

        previewShapeRef.current = {
          id: crypto.randomUUID(),
          type: 'rectangle',
          x: world.x,
          y: world.y,
          width: 0,
          height: 0,
          fill: '#90caf9',
          stroke: '#1565c0',
        }

        return
      }
    }

    const stopDragging = () => {
      if (
        tool === 'rectangle' &&
        drawingRef.current &&
        previewShapeRef.current
      ) {
        const rectangle = normalizeRectangle(previewShapeRef.current)

        shapesRef.current.push(rectangle)

        previewShapeRef.current = null

        requestRender()
      }

      drawingRef.current = false
      startPointRef.current = null

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
    previewShapeRef,
  }
}