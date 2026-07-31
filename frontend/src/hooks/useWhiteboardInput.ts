import { useEffect, useRef, useState } from 'react'
import type { UseWhiteboardInputProps } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import { handleDrawingMouseDown } from '../interaction/handleDrawingMouseDown'
import { handleDrawingMouseMove } from '../interaction/handleDrawingMouseMove'
import { handleKeyDown } from '../interaction/handleKeyDown'
import { handleMouseUp } from '../interaction/handleMouseUp'
import { handleMovingObjectMouseMove } from '../interaction/handleMovingObjectMouseMove'
import { handlePanMouseDown } from '../interaction/handlePanMouseDown'
import { handlePanMouseMove } from '../interaction/handlePanMouseMove'
import { handleResizeMouseMove } from '../interaction/handleResizeMouseMove'
import { handleSelectionMouseDown } from '../interaction/handleSelectionMouseDown'
import { handleSelectionMouseMove } from '../interaction/handleSelectionMouseMove'
import { handleZoom } from '../interaction/handleZoom'
import { getObjectById } from '../objects/getObjectById'
import type { Point } from '../types/Types'
import { screenToWorld } from '../camera/Camera'

export function useWhiteboardInput({
  cameraRef,
  requestRender,
  document,
  tool,
  editor,
  presence,

  setSelectedObjectId,
  selectedObjectIdRef,
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

  const selectObject = (id: string | null) => {
    selectedObjectIdRef.current = id
    setSelectedObjectId(id)
  }

  const getSelectedObject = () => {
    if (!selectedObjectIdRef.current) {
      return undefined
    }

    return getObjectById(
      document.objectsRef.current,
      selectedObjectIdRef.current
    )
  }

  // Handle mouse and keyboard events for the whiteboard
  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const keyDownHandler = handleKeyDown({
      setShowCoordinates,
      getSelectedObjectId: () => selectedObjectIdRef.current,
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

      console.log("Ending interaction");useWhiteboardInput
      interactionRef.current = {
        type: "idle",
      }

      canvas.style.cursor = "grab"
    }
    // Handle mouse move events for dragging, drawing, and moving objects
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
        getSelectedObject,
        editor,
        presence,
      })
      ) {
        return
      }

      // Update the preview object if drawing a rectangle
      if (handleDrawingMouseMove({
        world,
        interactionRef,
        requestRender,
        presence,
      })
      ) {
        return
      }
      // Update the position of the object being moved if moving an object
      if (handleMovingObjectMouseMove({
        world,
        interactionRef,
        getSelectedObject,
        editor,
        presence,
      })
      ) {
        return
      }

      mouseScreenRef.current = pointer

      if (tool === 'select') {
        handleSelectionMouseMove({
          object: getSelectedObject(),
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
    // Handle mouse down events for drawing, moving, and selecting objects
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
          objects: document.objectsRef.current,
          camera: cameraRef.current,
          getSelectedObject,
          selectObject,
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
        getSelectedObject,
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
    setSelectedObjectId,
    editor,
    presence,
    document,
  ])

  return {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    interactionRef,
  }
}