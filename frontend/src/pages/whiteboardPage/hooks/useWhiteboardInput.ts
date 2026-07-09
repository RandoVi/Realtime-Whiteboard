import { useEffect, useRef, useState } from 'react'
import type { Camera, Point } from '../Types'
import { screenToWorld, zoomAtPoint, ZOOM_SENSITIVITY } from '../Camera'
import type { UseWhiteboardInputProps } from '../Types'
import type { Shape } from '../shapes/Shape'
import { normalizeRectangle } from '../shapes/geometry/normalizeRectangle'
import { hitTestShape } from '../shapes/hitTest'
import type { ResizeHandle } from '../tools/selection'
import type { Rectangle } from '../shapes/Rectangle'
import { hitTestHandle } from '../tools/hitTestHandle'
import { resizeRectangle } from '../shapes/geometry/resizeRectangle'

export function useWhiteboardInput({
  cameraRef,
  viewportRef,
  requestRender,
  shapesRef,
  tool,
  selectedShapeId,
  setSelectedShapeId,
  selectedShapeIdRef,
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
  // moving state
  const movingShapeRef = useRef(false)
  const moveStartRef = useRef<Point | null>(null)
  const originalShapeRef = useRef<Shape | null>(null)
  // resizing state
  const resizingRef = useRef(false)
  const resizeHandleRef = useRef<ResizeHandle | null>(null)
  const originalRectangleRef = useRef<Rectangle | null>(null)
  // hovered handle state
  const hoveredHandleRef =
  useRef<ResizeHandle | null>(null)
  

  const bindCanvas = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
  }

  // Handle mouse wheel events for zooming
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
    // Handle mouse move events for dragging, drawing, and moving shapes
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // Update the mouse position in screen coordinates, aka screen space
      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
      const world = screenToWorld(pointer, cameraRef.current)

      if (
        resizingRef.current &&
        resizeHandleRef.current &&
        originalRectangleRef.current &&
        selectedShapeId
      ) {
        const rectangle = shapesRef.current.find(
          shape => shape.id === selectedShapeId
        )

        if (
          rectangle &&
          rectangle.type === 'rectangle'
        ) {
          resizeRectangle(
            rectangle,
            originalRectangleRef.current,
            resizeHandleRef.current,
            world
          )

          const normalized = normalizeRectangle(rectangle)

          rectangle.x = normalized.x
          rectangle.y = normalized.y
          rectangle.width = normalized.width
          rectangle.height = normalized.height

          requestRender()
        }

        return
      }

      // Update the preview shape if drawing a rectangle
      if (
        tool === 'rectangle' &&
        drawingRef.current &&
        startPointRef.current &&
        previewShapeRef.current
      ) {

        previewShapeRef.current = {
          ...previewShapeRef.current,

          width: world.x - startPointRef.current.x,
          height: world.y - startPointRef.current.y,
        }

        requestRender()
      }
      // Update the position of the shape being moved if moving a shape
      if (
        movingShapeRef.current &&
        moveStartRef.current &&
        originalShapeRef.current &&
        selectedShapeId
      ) {
        const dx = world.x - moveStartRef.current.x
        const dy = world.y - moveStartRef.current.y

        const shape = shapesRef.current.find(
          shape => shape.id === selectedShapeId
        )

        if (shape) {
          shape.x = originalShapeRef.current.x + dx
          shape.y = originalShapeRef.current.y + dy

          requestRender()
        }

        return
      }

      mouseScreenRef.current = pointer

      if (
        tool === 'select' &&
        !movingShapeRef.current &&
        selectedShapeIdRef.current
      ) {
        const shape = shapesRef.current.find(
          shape => shape.id === selectedShapeIdRef.current
        )

        if (shape && shape.type === 'rectangle') {
          const handle = hitTestHandle(
            pointer,
            shape,
            cameraRef.current
          )

          hoveredHandleRef.current = handle

          switch (handle) {
            case 'nw':
            case 'se':
              canvas.style.cursor = 'nwse-resize'
              break

            case 'ne':
            case 'sw':
              canvas.style.cursor = 'nesw-resize'
              break

            default:
              canvas.style.cursor = 'grab'
          }
        }
      }
      
      // If dragging, update the camera offset based on the mouse movement
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
    // Handle mouse down events for drawing, moving, and selecting shapes
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


        // 1. Check selected shape handles first
        if (selectedShapeIdRef.current) {

          const selectedShape = shapesRef.current.find(
            shape => shape.id === selectedShapeIdRef.current
          )

          if (
            selectedShape &&
            selectedShape.type === 'rectangle'
          ) {
            const handle = hitTestHandle(
              pointer,
              selectedShape,
              cameraRef.current
            )

            if (handle) {
              resizingRef.current = true
              resizeHandleRef.current = handle
              originalRectangleRef.current = {
                ...selectedShape
              }

              return
            }
          }
        }


        // 2. Otherwise check shape body
        const clickedShape = shapesRef.current
          .slice()
          .reverse()
          .find(shape =>
            hitTestShape(world, shape)
          )


        if (clickedShape) {

          selectedShapeIdRef.current = clickedShape.id
          setSelectedShapeId(clickedShape.id)

          movingShapeRef.current = true
          moveStartRef.current = world
          originalShapeRef.current = {
            ...clickedShape
          }

          requestRender()
          return
        }


        // 3. Clicked empty space
        selectedShapeIdRef.current = null
        setSelectedShapeId(null)

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
    // Stop dragging or drawing when the mouse is released
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
      // Reset all interaction states
      drawingRef.current = false
      startPointRef.current = null
      draggingRef.current = false
      // Reset moving state of the shape
      movingShapeRef.current = false
      moveStartRef.current = null
      originalShapeRef.current = null
      // Reset resizing state of the shape
      resizingRef.current = false
      resizeHandleRef.current = null
      originalRectangleRef.current = null

      canvas.style.cursor = 'grab'
    }
    // Handle key down events for toggling coordinate display
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'm' || event.repeat) return

      setShowCoordinates((v) => !v)
    }

    // Add event listeners for mouse and keyboard events

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
  }, [
    showCoordinates,
    cameraRef,
    requestRender,
    tool,
    selectedShapeId,
    setSelectedShapeId,
  ])

  return {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    previewShapeRef,
  }
}