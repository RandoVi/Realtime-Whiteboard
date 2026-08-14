import { useEffect, useMemo, useRef, useState } from 'react'
import type { Camera } from '../types/Types'
import { renderGrid } from '../render/renderGrid'
import { renderBackground } from '../render/renderBackground'
import { useWhiteboardInput } from '../hooks/useWhiteboardInput'
import { renderObjects } from '../render/renderObjects'
import './Whiteboard.css'
import { BottomToolbar } from '../ui/toolbars/BottomToolbar'
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
import { ShapeMenu } from '../ui/ShapeMenu'
import { ShapeSettings } from '../ui/ShapeSettings'
import type { RemotePresence } from '../socket/preview/RemotePresence'
import { getCurrentUser, setCurrentUser } from '../network/currentUser'
import { getRenderedObject } from '../objects/getRenderedObjects'
import type { Object } from '../types/Object'
import { createRemotePresence } from "../socket/preview/createRemotePresence";
import type { Laser } from "../objects/laser/Laser";
import { DEFAULT_FILL, DEFAULT_STROKE_COLOR } from '../objects/defaults'
import { DrawingMenu } from '../ui/DrawingMenu'
import { RemoteCursors } from '../ui/cursors/RemoteCursors'


function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const transformRef = useRef<Camera>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  const remotePresence = useRef(
    new Map<string, RemotePresence>()
  );
  const localLasers = useRef<Laser[]>([]);

  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 }) // dpr = device pixel ratio
  const resizeInitializedRef = useRef(false)
  const renderFrameRef = useRef<number | null>(null)
  const renderDirtyRef = useRef(false)
  const document = useMemo(
    () =>
      createDocument([]),
    []
  )
  //lobby state and id
  const [lobbyState, setLobbyState] = useState<LobbyState>("lobby");
  const [boardId, setBoardId] = useState("");

  

  const [showDrawingMenu, setShowDrawingMenu] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showShapeSettings, setShowShapeSettings] = useState(false);
  const [shapeSettings, setShapeSettings] = useState({
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE_COLOR,
  });

  const [, setDocumentRevision] = useState(0)
  const [, setCursorRevision] = useState(0);

  const openShapeMenu = () => {
    setShowShapeMenu(prev => !prev);
    setShowDrawingMenu(false);
    setShowShapeSettings(false);
  };

  const openDrawingMenu = () => {
    setShowDrawingMenu(prev => !prev);
    setShowShapeMenu(false);
    setShowShapeSettings(false);
  };


  const closeShapeSettings = () => {
    setShowShapeSettings(false);
  };

  const selectTool = (tool: Tool) => {
    setTool(tool);
    setShowShapeSettings(false);
    setShowShapeMenu(false);
    setShowDrawingMenu(false);
  };

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
    const {
      hasAnimatedObjects,
      finishedObjects,
      finishedLocalLasers,
      finishedRemoteLasers,
    } = renderObjects(
      context,
      document.objectsRef.current,
      camera,
      interactionRef.current,
      remotePresence.current,
      localLasers.current,
    );

    for (const object of finishedObjects) {
      editor.execute({
        type: "deleteBoardObject",
        boardObjectId: object.id,
      });
    }
    // Remove finished lasers from local and remote presence
    for (const laser of finishedLocalLasers) {

      const index = localLasers.current.findIndex(
        item => item.id === laser.id
      );

      if (index !== -1) {
        localLasers.current.splice(index, 1);
      }
    }
    // Remove finished lasers from remote presence
    for (const { userId, laser } of finishedRemoteLasers) {

      const presence =
        remotePresence.current.get(userId);

      if (!presence) {
        continue;
      }

      const index = presence.lasers.findIndex(
        item => item.id === laser.id
      );

      if (index !== -1) {
        presence.lasers.splice(index, 1);
      }
    }

    if (hasAnimatedObjects) {
      requestRender();
    }


    let selectedObject: Object | undefined;

    if (interactionRef.current.type === "moving") {
      selectedObject = interactionRef.current.preview;
    } else if (selectedObjectIdRef.current) {
      selectedObject = getObjectById(
        document.objectsRef.current,
        selectedObjectIdRef.current
      );

      if (selectedObject) {
        for (const presence of remotePresence.current.values()) {
          if (
            presence.preview?.type === "update" &&
            presence.preview.objectId === selectedObject.id
          ) {
            selectedObject = getRenderedObject(
              selectedObject,
              presence
            );

            break;
          }
        }
      }
    }
    const currentUser = getCurrentUser();

    if (selectedObject && currentUser) {
      renderSelection(
        context,
        selectedObject,
        camera,
        currentUser.color,
      )
    }
    for (const [userId, presence] of remotePresence.current) {

      if (!presence.selectedObjectId) {
        continue;
      }

      const object = getObjectById(
        document.objectsRef.current,
        presence.selectedObjectId,
      );

      if (!object) {
        continue;
      }

      const user = document.usersRef.current.find(
        user => user.userId === userId
      );

      if (!user) {
        continue;
      }

      const renderedObject = getRenderedObject(
        object,
        presence,
      );

      renderSelection(
        context,
        renderedObject,
        camera,
        user.color,
        false,
      );
    }
  }

 const requestRender = () => {
  renderDirtyRef.current = true;

  if (renderFrameRef.current !== null) {
    return;
  }

  renderFrameRef.current = requestAnimationFrame(() => {
    renderFrameRef.current = null;

    if (!renderDirtyRef.current) {
      return;
    }

    renderDirtyRef.current = false;

    render();
  });
};

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
        collaboration,
        onDocumentChange: () => {
          setDocumentRevision(prev => prev + 1)
        },
      }),
    [document, collaboration]
  );

  useEffect(() => {

    collaboration.onCommand(
      command => {

        console.log("REMOTE COMMAND:", command);

        editor.execute(
          command,
          {
            broadcast: false,
          }
        );

        console.log(
          "OBJECT AFTER REMOTE COMMAND:",
          document.objectsRef.current.find(
            object =>
              object.id ===
              (
                command.type === "createBoardObject"
                  ? command.boardObject.id
                  : command.type === "updateBoardObject"
                    ? command.boardObjectId
                    : ""
              )
          )
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
    onStartInteraction: closeShapeSettings,
    objectStyle: shapeSettings,
    remotePresence: remotePresence.current,
    localLasers: localLasers.current,
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
      (boardState) => {
        setBoardId(boardState.boardId);
        setNetworkBoardId(boardState.boardId);

        document.load(
          boardState.objects,
          boardState.users,
        );
        const currentUser = boardState.users.find(
          user => user.userId === boardState.userId
        );

        if (!currentUser) {
          throw new Error("Current user not found.");
        }

        setCurrentUser(currentUser);

        requestRender();

        setLobbyState("created");
      }
    );
  };

  useEffect(() => {
    collaboration.onUserJoined(user => {
      document.addUser(user);
      requestRender();
    });
  }, [collaboration, document]);

  useEffect(() => {
    presence.onCommand(
      (userId, command) => {

        switch (command.type) {

          case "cursorMovement": {
            // console.log("Received cursor movement", {
            //   userId,
            //   point: command.point,
            // });
            const userPresence =
              remotePresence.current.get(userId)
              ?? createRemotePresence();

            userPresence.cursor = command.point;

            remotePresence.current.set(
              userId,
              userPresence,
            );

            setCursorRevision(prev => prev + 1);

            break;
          }

          case "objectPreview": {

            const userPresence =
              remotePresence.current.get(userId)
              ?? createRemotePresence();

            if (command.previewType === "create") {
              userPresence.preview = {
                type: "create",
                object: command.boardObject,
              };
            }

            if (command.previewType === "update") {
              userPresence.preview = {
                type: "update",
                objectId: command.boardObjectId,
                updates: command.updates,
              };
            }

            if (command.previewType === "clear") {
              userPresence.preview = undefined;
            }

            remotePresence.current.set(
              userId,
              userPresence,
            );

            requestRender();

            break;
          }

          case "selection": {
            const interaction = interactionRef.current;

            if (
              command.objectId !== null &&
              command.objectId === selectedObjectIdRef.current
            ) {

              selectedObjectIdRef.current = null;
              setSelectedObjectId(null);

              if (
                interaction.type === "moving" &&
                interaction.objectId === command.objectId
              ) {
                interactionRef.current = {
                  type: "idle",
                };
              }

              if (
                interaction.type === "resizing" &&
                interaction.objectId === command.objectId
              ) {
                interactionRef.current = {
                  type: "idle",
                };
              }

              // Tell everyone that I no longer own this selection.
              presence.send({
                type: "selection",
                objectId: null,
              });
            }

            const userPresence =
              remotePresence.current.get(userId)
              ?? createRemotePresence();

            userPresence.selectedObjectId =
              command.objectId;

            remotePresence.current.set(
              userId,
              userPresence,
            );

            requestRender();

            break;
          }

          case "laser": {

            const userPresence =
              remotePresence.current.get(userId)
              ?? createRemotePresence();

            if (command.laserType === "create") {

              userPresence.lasers.push(
                command.laser
              );
            }

            if (command.laserType === "point") {

              // console.log("RECEIVED LASER POINT", {
              //   userId,
              //   laserId: command.laserId,
              //   point: command.point,
              // });

              const laser = userPresence.lasers.find(
                laser => laser.id === command.laserId
              );

              if (!laser) {
                console.log("LASER NOT FOUND FOR POINT", {
                  laserId: command.laserId,
                  lasers: userPresence.lasers,
                });
                break;
              }

              if (!laser) {
                break;
              }

              laser.points.push({
                point: command.point,
                createdAt: performance.now(),
              });
            }

            remotePresence.current.set(
              userId,
              userPresence,
            );

            requestRender();

            break;
          }
        }

      }
    );
  }, [presence]);

  const handleJoin = () => {

    setLobbyState("joining");

    collaboration.joinBoard(
      boardId,
      (boardState) => {

        setBoardId(boardState.boardId);
        setNetworkBoardId(boardState.boardId);

        document.load(
          boardState.objects,
          boardState.users,
        );

        const currentUser = boardState.users.find(
          user => user.userId === boardState.userId
        );

        if (!currentUser) {
          throw new Error("Current user not found.");
        }

        setCurrentUser(currentUser);

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

      <RemoteCursors
        remotePresence={remotePresence.current}
        users={document.usersRef.current}
        camera={transformRef.current}
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

      {showDrawingMenu && (
        <DrawingMenu
          onSelectTool={(tool) => {
            setTool(tool);
            setShowDrawingMenu(false);
            setShowShapeSettings(false);
          }}
        />
      )}

      {showShapeMenu && (
        <ShapeMenu
          onSelectShape={(tool) => {
            setTool(tool);
            setShowShapeMenu(false);
            setShowShapeSettings(true);
          }}
        />
      )}

      {showShapeSettings && (
        <ShapeSettings
          fill={shapeSettings.fill}
          stroke={shapeSettings.stroke}
          setFill={(fill) =>
            setShapeSettings(prev => ({
              ...prev,
              fill
            }))
          }
          setStroke={(stroke) =>
            setShapeSettings(prev => ({
              ...prev,
              stroke
            }))
          }
        />
      )}

      <BottomToolbar
        tool={tool}
        setTool={selectTool}
        onShapeClick={openShapeMenu}
        onDrawingClick={openDrawingMenu}
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
