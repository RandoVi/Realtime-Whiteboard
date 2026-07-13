import { useEffect, useRef, useState } from 'react'
import type { Camera, Point } from '../Types'
import { screenToWorld, zoomAtPoint, ZOOM_SENSITIVITY } from '../Camera'
import type { UseWhiteboardInputProps } from '../Types'
import { hitTestShape } from '../shapes/hitTest'
import type { Interaction } from '../interaction/Interaction'
import { moveShape } from '../shapes/geometry/moveShape'
import { getShapeById } from '../shapes/getShapeById'
import { getResizeHandleForShape } from '../render/selection/getResizeHandleForShape'
import { resizeShape } from '../shapes/geometry/resizeShape'
import { normalizeShape } from '../shapes/geometry/normalizeShape'
import { updatePreviewShape } from '../shapes/updatePreviewShape'
import { createShape } from '../shapes/createShape'
import { getSelectionCursor } from '../render/selection/getSelectionCursor'

export function useWhiteboardInput({
  cameraRef,
  viewportRef,
  requestRender,
  shapesRef,
  tool,

  setSelectedShapeId,
  selectedShapeIdRef,
}: UseWhiteboardInputProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [showCoordinates, setShowCoordinates] = useState(false)
  const [mouseWorld, setMouseWorld] = useState<Point | null>(null)

  const mouseScreenRef = useRef<Point>({ x: 0, y: 0 })
  const interactionRef = useRef<Interaction>({
    type: "idle",
  })

  const bindCanvas = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
  }

  const selectShape = (id: string | null) => {
    selectedShapeIdRef.current = id
    setSelectedShapeId(id)
  }

  const getSelectedShape = () => {
    if (!selectedShapeIdRef.current) {
      return undefined
    }

    return getShapeById(
      shapesRef.current,
      selectedShapeIdRef.current
    )
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
        interactionRef.current.type === "resizingShape"
      ) {
        const interaction = interactionRef.current

        const shape = getSelectedShape()

        if (shape) {
          resizeShape(
            shape,
            interaction.original,
            interaction.handle,
            world
          )

          requestRender()
        }

        return
      }

      // Update the preview shape if drawing a rectangle
      if (interactionRef.current.type === 'drawingShape') {
        updatePreviewShape(
          interactionRef.current.preview,
          interactionRef.current.start,
          world
        )

        requestRender()
        return
      }
      // Update the position of the shape being moved if moving a shape
      if (interactionRef.current.type === "movingShape") {

        const interaction = interactionRef.current

        const dx = world.x - interaction.start.x
        const dy = world.y - interaction.start.y

        const shape = getSelectedShape()

        if (shape) {
          moveShape(
            shape,
            interaction.original,
            dx,
            dy,
          )

          requestRender()
        }

        return
      }

      mouseScreenRef.current = pointer

      if (tool === 'select') {
        const shape = getSelectedShape()

        if (shape) {
          const handle = getResizeHandleForShape(
            shape,
            pointer,
            cameraRef.current
          )

          canvas.style.cursor = getSelectionCursor(handle)
        }
      }

      // Handle panning if the current interaction is panning
      if (interactionRef.current.type === "panning") {
        const interaction = interactionRef.current

        const dx = pointer.x - interaction.start.x
        const dy = pointer.y - interaction.start.y

        interactionRef.current = {
          ...interaction,
          start: pointer,
        }

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

          const selectedShape = getSelectedShape()

          if (selectedShape) {
            const handle = getResizeHandleForShape(
              selectedShape,
              pointer,
              cameraRef.current
            )

            if (handle) {
              interactionRef.current = {
                type: "resizingShape",
                shapeId: selectedShape.id,
                original: { ...selectedShape },
                handle,
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

          selectShape(clickedShape.id)

          interactionRef.current = {
            type: "movingShape",
            start: world,
            original: { ...clickedShape },
            shapeId: clickedShape.id,
          }

          requestRender()
          return
        }

        // 3. Clicked empty space
        selectShape(null)

        requestRender()
        return
      }

      if (tool === 'pan') {
        interactionRef.current = {
          type: "panning",
          start: pointer,
        }

        canvas.style.cursor = 'grabbing'
        return
      }

      const world = screenToWorld(
        pointer,
        cameraRef.current
      )

      const shape = createShape(
        tool,
        world
      )

      if (shape) {
        interactionRef.current = {
          type: "drawingShape",
          start: world,
          preview: shape,
        }

        return
      }
    }
    // Stop dragging or drawing when the mouse is released
    const handleMouseUp = () => {
      const interaction = interactionRef.current

      switch (interaction.type) {
        case "drawingShape": {
          const shape = normalizeShape({
            ...interaction.preview,
          })

          shapesRef.current.push(shape)
          requestRender()

          break
        }

        case "resizingShape": {
          const shape = getSelectedShape()

          if (shape) {
            const normalized = normalizeShape(shape)

            Object.assign(
              shape,
              normalized
            )

            requestRender()
          }

          break
        }
      }

      interactionRef.current = {
        type: "idle",
      }

      canvas.style.cursor = 'grab'
    }
    // Handle key down events for toggling coordinate display
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'm' || event.repeat) return

      setShowCoordinates((v) => !v)
    }
    // Add event listeners for mouse and keyboard events
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)

    canvas.addEventListener('wheel', handleZoom, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)

      canvas.removeEventListener('wheel', handleZoom)
      canvas.removeEventListener('mousedown', handleMouseDown)
    }
  }, [
    showCoordinates,
    cameraRef,
    requestRender,
    tool,
    setSelectedShapeId,
  ])

  return {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    interactionRef,
  }
}