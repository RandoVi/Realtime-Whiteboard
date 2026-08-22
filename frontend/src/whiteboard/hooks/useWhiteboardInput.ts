import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Interaction } from '../../interaction/Interaction'
import { handleKeyDown } from '../../interaction/handlers/handleKeyDown'
import { handleMouseUp } from '../../interaction/handlers/handleMouseUp'
import { handleZoom } from '../../interaction/handlers/handleZoom'
import type { Point } from "@common/types";
import { screenToWorld, type Camera } from '../../camera/Camera'
import { getPointer } from '../../interaction/helpers/getPointer'
import { handleMouseMove as handleInteractionMouseMove } from '../../interaction/handlers/handleMouseMove'
import { handleMouseDown as handleInteractionMouseDown } from '../../interaction/handlers/handleMouseDown'
import type { CanvasInteractionContext, TextEditorRef } from '../../interaction/CanvasInteractionContext'
import { handleDoubleClick } from '../../interaction/handlers/handleDoubleClick'
import { rotateDrawing } from '../../interaction/drawing/rotateDrawing'
import type { Laser } from '@common/shapes'
import type { Editor } from '../../editor/Editor'
import type { RemotePresence } from '../../network/presence/RemotePresence'
import type { ObjectStyle } from '../../objects/ObjectStyle'
import type { Tool } from '../../types/Tool'
import type { BoardDocument } from '../../document/Document'

export type UseWhiteboardInputProps = {
  cameraRef: RefObject<Camera>
  viewportRef: RefObject<{
    width: number
    height: number
    dpr: number
  }>
  requestRender: () => void
  document: BoardDocument
  tool: Tool
  editor: Editor
  presence: any
  setSelectedObjectId: React.Dispatch<
    React.SetStateAction<string | null>
  >
  selectedObjectIdRef: React.RefObject<string | null>
  onStartInteraction: () => void;
  objectStyle: ObjectStyle;
  remotePresence: Map<string, RemotePresence>;
  localLasers: Laser[];
}


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
  const textEditorRef =
    useRef<TextEditorRef | null>(null);

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
    textEditorRef,
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

      const interaction =
        interactionRef.current

      if (
        interaction.type === "drawing" &&
        "rotation" in interaction.preview
      ) {
        event.preventDefault()

        rotateDrawing(
          event.deltaY,
          contextRef.current!,
        )

        return
      }

      handleZoom({
        event,
        canvas,
        cameraRef,
        textEditorRef,
        requestRender,
        showCoordinates,
        mouseScreenRef,
        setMouseWorld,
      })
    }

    // Handle mouse move events for dragging, drawing, and moving objects
    const handleMouseMove = (event: MouseEvent) => {
      const pointer = getPointer(event, canvas);

      mouseScreenRef.current = pointer;

      const world = screenToWorld(
        pointer,
        cameraRef.current
      );

      if (showCoordinates) {
        setMouseWorld(world);
      }

      handleInteractionMouseMove({
        pointer,
        world,
        context: contextRef.current!,
        constrain: event.ctrlKey,
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

    // const parent is used because of textbox that is not inside the canvas while editing. Maybe improve later.
    const parent = canvas.parentElement;

    parent?.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
        capture: true,
      }
    );
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('dblclick', handleDoubleClickEvent)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUpEvent)
      window.removeEventListener('keydown', keyDownHandler)

      parent?.removeEventListener("wheel", handleWheel, { capture: true });
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