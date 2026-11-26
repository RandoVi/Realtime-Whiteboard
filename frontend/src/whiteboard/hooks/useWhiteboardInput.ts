import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import type { Point } from "@common/types";
import type { Laser } from "@common/shapes";
import { screenToWorld, type Camera } from "../../camera/Camera";
import type { BoardDocument } from "../../document/Document";
import type { Editor } from "../../editor/Editor";
import type { CanvasInteractionContext, TextEditorRef } from "../../interaction/CanvasInteractionContext";
import type { Interaction } from "../../interaction/Interaction";
import { rotateDrawing } from "../../interaction/drawing/rotateDrawing";
import { getPointer } from "../../interaction/helpers/getPointer";
import { updateInteractionAtCurrentPointer } from "../../interaction/helpers/updateInteractionAtCurrentPointer";
import { handleDoubleClick } from "../../interaction/handlers/handleDoubleClick";
import { handleKeyDown } from "../../interaction/handlers/handleKeyDown";
import { handleMouseDown as handleInteractionMouseDown } from "../../interaction/handlers/handleMouseDown";
import { handleMouseMove as handleInteractionMouseMove } from "../../interaction/handlers/handleMouseMove";
import { handleMouseUp } from "../../interaction/handlers/handleMouseUp";
import { handleZoom } from "../../interaction/handlers/handleZoom";
import type { Presence } from "../../network/presence/Presence";
import type { RemotePresence } from "../../network/presence/RemotePresence";
import type { ObjectStyle } from "../../objects/ObjectStyle";
import type { Tool } from "../../types/Tool";

export type UseWhiteboardInputProps = {
  cameraRef: MutableRefObject<Camera>;
  requestRender: () => void;
  document: BoardDocument;
  tool: Tool;
  setTool: (tool: Tool) => void;
  editor: Editor;
  presence: Presence;
  setSelectedObjectId: Dispatch<SetStateAction<string | null>>;
  selectedObjectIdRef: MutableRefObject<string | null>;
  selectedObjectIdsRef: MutableRefObject<string[]>;
  setSelectedObjectIds: (ids: string[]) => void;
  onStartInteraction: () => void;
  objectStyle: ObjectStyle;
  remotePresence: Map<string, RemotePresence>;
  localLasers: Laser[];
};

export function useWhiteboardInput({
  cameraRef,
  requestRender,
  document,
  tool,
  setTool,
  editor,
  presence,
  setSelectedObjectId,
  selectedObjectIdRef,
  selectedObjectIdsRef,
  setSelectedObjectIds,
  onStartInteraction,
  objectStyle,
  remotePresence,
  localLasers,
}: UseWhiteboardInputProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [mouseWorld, setMouseWorld] = useState<Point | null>(null);
  const mouseScreenRef = useRef<Point>({ x: 0, y: 0 });
  const interactionRef = useRef<Interaction>({ type: "idle" });
  const textEditorRef = useRef<TextEditorRef | null>(null);

  const bindCanvas = (canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const selectObject = (id: string | null) => {
      selectedObjectIdRef.current = id;
      setSelectedObjectId(id);

      const nextSelectedIds = id ? [id] : [];
      selectedObjectIdsRef.current = nextSelectedIds;
      setSelectedObjectIds(nextSelectedIds);

      presence.send({
        type: "selection",
        objectIds: nextSelectedIds,
      });
    };

    const context: CanvasInteractionContext = {
      canvas,
      cameraRef,
      interactionRef,
      textEditorRef,
      document,
      editor,
      presence,
      requestRender,
      setTool,
      getSelectedObject: editor.getSelectedObject,
      selectObject,
      selectedObjectIdRef,
      setSelectedObjectId,
      selectedObjectIdsRef,
      setSelectedObjectIds,
      objectStyle,
      remotePresence,
      localLasers,
    };

    const updateInteraction = (constrain: boolean) => {
      updateInteractionAtCurrentPointer({
        pointer: mouseScreenRef.current,
        camera: cameraRef.current,
        context,
        constrain,
      });
    };

    const keyDownHandler = handleKeyDown({
      setShowCoordinates,
      getSelectedObjectId: () => selectedObjectIdRef.current,
      editor,
      updateInteractionAtCurrentPointer: updateInteraction,
    });

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        updateInteraction(false);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      const interaction = interactionRef.current;

      if (
        interaction.type === "drawing" &&
        "rotation" in interaction.preview
      ) {
        event.preventDefault();
        rotateDrawing(event.deltaY, context);
        return;
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
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const pointer = getPointer(event, canvas);
      mouseScreenRef.current = pointer;
      const world = screenToWorld(pointer, cameraRef.current);

      if (showCoordinates) {
        setMouseWorld(world);
      }

      handleInteractionMouseMove({
        pointer,
        world,
        context,
        constrain: event.ctrlKey,
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      onStartInteraction();
      const pointer = getPointer(event, canvas);
      const world = screenToWorld(pointer, cameraRef.current);

      handleInteractionMouseDown({
        pointer,
        world,
        tool,
        canvas,
        context,
        multiSelect: event.ctrlKey || event.metaKey,
      });
    };

    const handleMouseUpEvent = () => {
      handleMouseUp({ context });
      canvas.style.cursor = "default";
    };

    const handleDoubleClickEvent = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      const pointer = getPointer(event, canvas);
      const world = screenToWorld(pointer, cameraRef.current);
      handleDoubleClick({ world, context });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUpEvent);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", handleKeyUp);

    // Textbox editing can happen outside the canvas, so listen on its parent.
    const parent = canvas.parentElement;
    parent?.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("dblclick", handleDoubleClickEvent);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpEvent);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", handleKeyUp);
      parent?.removeEventListener("wheel", handleWheel, { capture: true });
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("dblclick", handleDoubleClickEvent);
    };
  }, [
    showCoordinates,
    cameraRef,
    requestRender,
    tool,
    setTool,
    editor,
    presence,
    document,
    selectedObjectIdRef,
    setSelectedObjectId,
    selectedObjectIdsRef,
    setSelectedObjectIds,
    onStartInteraction,
    objectStyle,
    remotePresence,
    localLasers,
  ]);

  return {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    interactionRef,
  };
}
