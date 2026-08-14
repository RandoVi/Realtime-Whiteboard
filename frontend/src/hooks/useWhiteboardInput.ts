import { useEffect, useRef, useState } from 'react'
import type { UseWhiteboardInputProps } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import { handleKeyDown } from '../interaction/handleKeyDown'
import { handleMouseUp } from '../interaction/handleMouseUp'
import { handleZoom } from '../interaction/handleZoom'
import type { Point } from '../types/Types'
import { screenToWorld } from '../camera/Camera'
import { getPointer } from '../interaction/helpers/getPointer'
import { handleMouseMove as handleInteractionMouseMove } from '../interaction/handleMouseMove'
import { handleMouseDown as handleInteractionMouseDown } from '../interaction/handleMouseDown'
import type { CanvasInteractionContext } from '../interaction/CanvasInteractionContext'
import { handleDoubleClick } from '../interaction/handleDoubleClick'

export function useWhiteboardInput({
  cameraRef,
  requestRender,
  document,
  tool,
  editor,
  presence,
  setSelectedObjectId,
  selectedObjectIdRef,
  onStartInteraction,
  objectStyle,
  remotePresence,
  localLasers,
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
    // console.log("sending selection:", id);
    presence.send({
      type: "selection",
      objectId: id,
    });
  }

  const contextRef = useRef<CanvasInteractionContext | null>(null);

  contextRef.current = {
    canvas: canvasRef.current!,
    cameraRef,
    interactionRef,
    document,
    editor,
    presence,
    requestRender,
    getSelectedObject: editor.getSelectedObject,
    selectObject,
    objectStyle,
    remotePresence,
    localLasers,
  };

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

    // Handle mouse move events for dragging, drawing, and moving objects
    const handleMouseMove = (event: MouseEvent) => {
      const pointer = getPointer(event, canvas);

      const world = screenToWorld(
        pointer,
        cameraRef.current
      );

      handleInteractionMouseMove({
        pointer,
        world,
        context: contextRef.current!,
      });
    };
    // Handle mouse down events for drawing, moving, and selecting objects
    const handleMouseDown = (event: MouseEvent) => {

      if (event.button !== 0) return;
      onStartInteraction();
      const pointer = getPointer(event, canvas);

      const world = screenToWorld(
        pointer,
        cameraRef.current
      );

      handleInteractionMouseDown({
        pointer,
        world,
        tool,
        canvas,
        context: contextRef.current!,
      });
    };
    // Stop dragging or drawing when the mouse is released
    const handleMouseUpEvent = () => {
      handleMouseUp({
        context: contextRef.current!,
      });

      canvas.style.cursor = "default";
    };

    const handleDoubleClickEvent = (event: MouseEvent) => {

      if (event.button !== 0) {
        return;
      }

      const pointer = getPointer(event, canvas);

      const world = screenToWorld(
        pointer,
        cameraRef.current
      );

      handleDoubleClick({
        world,
        context: contextRef.current!,
      });
    };

    // Add event listeners for mouse and keyboard events
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUpEvent)
    window.addEventListener('keydown', keyDownHandler)

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('dblclick', handleDoubleClickEvent)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUpEvent)
      window.removeEventListener('keydown', keyDownHandler)

      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('dblclick', handleDoubleClickEvent)
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