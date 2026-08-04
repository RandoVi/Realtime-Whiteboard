import { useEffect, useMemo, useRef, useState } from 'react'
import type { Camera } from '../types/Types'
import { renderGrid } from '../render/renderGrid'
import { renderBackground } from '../render/renderBackground'
import { useWhiteboardInput } from '../hooks/useWhiteboardInput'
import { renderObjects } from '../render/renderObjects'
import './Whiteboard.css'
import { BottomToolbar } from '../ui/BottomToolbar'
import type { Tool } from '../types/Tool'
import { renderSelection } from '../render/renderSelection'
import { getObjectById } from '../objects/getObjectById'
import { createEditor } from '../editor/createEditor'
import { ObjectInspector } from '../ui/objectPanel/ObjectInspector'
import { createDocument } from '../document/createDocument'
import { setBoardId as setNetworkBoardId } from "../network/board";
import { SocketCollaboration } from "../socket/collaboration/SocketCollaboration";
import { BoardLobbyModal, type LobbyState } from '../lobby/BoardLobbyModal'
import { SocketPresence } from '../socket/preview/SocketPresence'
import type { PreviewData } from "../render/renderObjects";

function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const transformRef = useRef<Camera>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  const remotePreviews = useRef(
    new Map<string, PreviewData>()
  );

  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 }) // dpr = device pixel ratio
  const resizeInitializedRef = useRef(false)
  const renderFrameRef = useRef<number | null>(null)
  const document = useMemo(
    () =>
      createDocument([]),
    []
  )
  //lobby state and id
  const [lobbyState, setLobbyState] = useState<LobbyState>("lobby");
  const [boardId, setBoardId] = useState("");


  const [tool, setTool] = useState<Tool>('pan')
  const [selectedObjectId, setSelectedObjectId] =
    useState<string | null>(null);
  const selectedObjectIdRef = useRef<string | null>(null)


  //--------------------- RENDERER
  const render = () => {
    const canvas = canvasRef.current
    // console.log("render");

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const camera = transformRef.current
    const { width, height, dpr } = viewportRef.current

    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)

    renderBackground(context, { width, height })
    renderGrid(context, camera, { width, height })
    console.log(remotePreviews.current);
    renderObjects(
      context,
      document.objectsRef.current,
      camera,
      interactionRef.current,
      remotePreviews.current
    )

    const selectedObject = selectedObjectIdRef.current
      ? getObjectById(
        document.objectsRef.current,
        selectedObjectIdRef.current
      )
      : undefined

    if (selectedObject) {
      renderSelection(
        context,
        selectedObject,
        camera,
      )
    }

  }

  const requestRender = () => {
    // console.log(renderFrameRef.current)
    if (renderFrameRef.current !== null) {
      return
    }

    renderFrameRef.current = requestAnimationFrame(() => {
      const id = renderFrameRef.current
      renderFrameRef.current = null

      try {
        render()
      } finally {
        // ensures the flag is cleared even if render() throws
        if (renderFrameRef.current === id) {
          renderFrameRef.current = null
        }
      }
    })
  }

  const collaboration = useMemo(
    () => new SocketCollaboration(),
    []
  );

  const presence = useMemo(
    () => new SocketPresence(),
    []
  );

  const editor = useMemo(
    () =>
      createEditor({
        document,
        selectedObjectIdRef,
        setSelectedObjectId,
        requestRender,
        collaboration
      }),
    [document, collaboration]
  );

  useEffect(() => {

    collaboration.onCommand(
      command => {

        editor.execute(
          command,
          {
            broadcast: false,
          }
        );

      }
    );

  }, [editor, collaboration]);

  const {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    interactionRef,
  } = useWhiteboardInput({
    cameraRef: transformRef,
    viewportRef,
    requestRender,
    document,
    tool,
    presence,
    editor,
    setSelectedObjectId,
    selectedObjectIdRef,
  })

  const resizeCanvas = () => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))

    viewportRef.current = { width, height, dpr }
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))

    if (!resizeInitializedRef.current) {
      resizeInitializedRef.current = true
      transformRef.current.offsetX = width / 2
      transformRef.current.offsetY = height / 2
    }

    requestRender()
  }



  useEffect(() => {
    resizeCanvas()

    const handleWindowResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)

      if (renderFrameRef.current !== null) {
        cancelAnimationFrame(renderFrameRef.current)
        renderFrameRef.current = null
      }
    }
  }, [])

  const selectedObject = selectedObjectId
    ? getObjectById(document.objectsRef.current, selectedObjectId)
    : undefined

  const handleCreate = () => {
    setLobbyState("creating");

    collaboration.createBoard(
      (id) => {
        setBoardId(id);
        setNetworkBoardId(id);
        setLobbyState("created");
      }
    );
  };

  useEffect(() => {
    presence.onCommand(
      command => {

        switch (command.type) {

          case "objectPreview":

            if (
              command.previewType === "create" &&
              command.boardObject
            ) {

              remotePreviews.current.set(
                command.boardObject.id,
                {
                  type: "create",
                  object: command.boardObject,
                }
              );

            }

            if (command.previewType === "update") {

              remotePreviews.current.set(
                command.boardObjectId,
                {
                  type: "update",
                  objectId: command.boardObjectId,
                  updates: command.updates,
                }
              );

            }

            requestRender();

            break;
        }

      }
    );
  }, [presence]);

  const handleJoin = () => {

    setLobbyState("joining");

    collaboration.joinBoard(
      boardId,
      (boardState) => {
        console.log("Joined board with id: " + boardState.boardId);
        setBoardId(boardState.boardId);
        setNetworkBoardId(boardState.boardId);
        document.load(boardState.objects);

        requestRender();

        setLobbyState("connected");
      }
    );
  };

  const handleStart = () => {
    setLobbyState("connected");

    // collaboration.startBoard(boardId);
  };
  return (
    <div className='whiteboard-page'>
      <canvas
        ref={(canvas) => {
          canvasRef.current = canvas
          bindCanvas(canvas)
        }}
        className="whiteboard-canvas"
      />
      <BoardLobbyModal
        state={lobbyState}
        boardId={boardId}
        onBoardIdChange={setBoardId}
        onCreate={handleCreate}
        onJoin={handleJoin}
        onStart={handleStart}
      />
      {/* <ObjectPanel /> */}
      <BottomToolbar
        tool={tool}
        setTool={setTool}
      />
      {selectedObjectId && (
        // <ObjectInspector editor={editor} />
        <ObjectInspector object={selectedObject} editor={editor} />

      )}

      {showCoordinates && mouseWorld && (
        <div className="coordinates-overlay">
          <div>x: {mouseWorld.x.toFixed(2)}</div>
          <div>y: {mouseWorld.y.toFixed(2)}</div>
          <div>Board ID: {boardId || "none"}</div>
        </div>

      )}

    </div>
  )
}

export default Whiteboard
