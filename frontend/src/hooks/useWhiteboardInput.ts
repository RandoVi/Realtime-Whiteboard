import { useEffect, useRef, useState } from 'react'
import type { UseWhiteboardInputProps } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import { handleDrawingMouseDown } from '../interaction/handleDrawingMouseDown'
import { handleDrawingMouseMove } from '../interaction/handleDrawingMouseMove'
import { handleKeyDown } from '../interaction/handleKeyDown'
import { handleMouseUp } from '../interaction/handleMouseUp'
import { handleMovingShapeMouseMove } from '../interaction/handleMovingShapeMouseMove'
import { handlePanMouseDown } from '../interaction/handlePanMouseDown'
import { handlePanMouseMove } from '../interaction/handlePanMouseMove'
import { handleResizeMouseMove } from '../interaction/handleResizeMouseMove'
import { handleSelectionMouseDown } from '../interaction/handleSelectionMouseDown'
import { handleSelectionMouseMove } from '../interaction/handleSelectionMouseMove'
import { handleZoom } from '../interaction/handleZoom'
import { getShapeById } from '../shapes/getShapeById'
import type { Point } from '../types/Types'
import { screenToWorld } from '../camera/Camera'

export function useWhiteboardInput({
  cameraRef,
  viewportRef,
  requestRender,
  document,
  tool,
  editor,

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
      document.shapesRef.current,
      selectedShapeIdRef.current
    )
  }

  // Handle mouse and keyboard events for the whiteboard
  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const keyDownHandler = handleKeyDown({
      setShowCoordinates,
      getSelectedShapeId: () => selectedShapeIdRef.current,
      editor,
    })

    const handleWheel = (event: WheelEvent) => {
      handleZoom({
        event,
        canvas,
        cameraRef,
        requestRender,
        showCoordinates,
        mouseScreenRef,
        setMouseWorld,
      })
    }

    const endInteraction = () => {
      interactionRef.current = {
        type: "idle",
      }

      canvas.style.cursor = "grab"
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

      if (handleResizeMouseMove({
        world,
        interactionRef,
        getSelectedShape,
        editor,
      })
      ) {
        return
      }

      // Update the preview shape if drawing a rectangle
      if (handleDrawingMouseMove({
        world,
        interactionRef,
        requestRender,
      })
      ) {
        return
      }
      // Update the position of the shape being moved if moving a shape
      if (handleMovingShapeMouseMove({
        world,
        interactionRef,
        getSelectedShape,
        editor,
      })
      ) {
        return
      }

      mouseScreenRef.current = pointer

      if (tool === 'select') {
        handleSelectionMouseMove({
          shape: getSelectedShape(),
          pointer,
          camera: cameraRef.current,
          canvas,
        })
      }

      // Handle panning if the current interaction is panning
      handlePanMouseMove({
        pointer,
        cameraRef,
        interactionRef,
        requestRender,
      })

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

        handleSelectionMouseDown({
          pointer,
          world,
          shapes: document.shapesRef.current,
          camera: cameraRef.current,
          getSelectedShape,
          selectShape,
          interactionRef,
          requestRender,
        })
        return
      }

      if (tool === "pan") {
        handlePanMouseDown({
          pointer,
          interactionRef,
          canvas,
        })
        return
      }

      const world = screenToWorld(
        pointer,
        cameraRef.current
      )

      handleDrawingMouseDown({
        tool,
        world,
        interactionRef,
      })
      return
    }
    // Stop dragging or drawing when the mouse is released
    const handleMouseUpEvent = () => {
      handleMouseUp({
        interactionRef,
        editor,
        getSelectedShape,
      })
      endInteraction()
    }

    // Add event listeners for mouse and keyboard events
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUpEvent)
    window.addEventListener('keydown', keyDownHandler)

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUpEvent)
      window.removeEventListener('keydown', keyDownHandler)

      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('mousedown', handleMouseDown)
    }
  }, [
    showCoordinates,
    cameraRef,
    requestRender,
    tool,
    setSelectedShapeId,
    editor,
    document,
  ])

  return {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    interactionRef,
  }
}