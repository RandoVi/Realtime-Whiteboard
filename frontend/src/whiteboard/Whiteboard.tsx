import { useEffect, useMemo, useRef, useState } from "react";

import { renderGrid } from "../rendering/renderGrid";
import { renderBackground } from "../rendering/renderBackground";
import { renderObjects, type PreviewData } from "../rendering/renderObjects";
import { renderSelection } from "../rendering/renderSelection";

import { useWhiteboardInput } from "./hooks/useWhiteboardInput";

import { createEditor } from "../editor/createEditor";
import { createDocument } from "../document/createDocument";
import { getObjectById } from "../objects/getObjectById";
import { getRenderedObject } from "../objects/getRenderedObjects";
import { DEFAULT_FILL, DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "../objects/defaults";

import { SocketCollaboration } from "../network/collaboration/SocketCollaboration";
import { SocketPresence } from "../network/presence/SocketPresence";
import { createRemotePresence } from "../network/presence/createRemotePresence";
import { getCurrentUser, setCurrentUser } from "../network/currentUser";
import { setBoardId as setNetworkBoardId } from "../network/board";

import { BottomToolbar } from "../ui/toolbars/BottomToolbar";
import { ObjectInspector } from "../ui/objectPanel/ObjectInspector";
import { BoardLobbyModal, type LobbyState } from "../ui/lobby/BoardLobbyModal";
import { ShapeMenu } from "../ui/ShapeMenu";
import { ShapeSettings } from "../ui/ShapeSettings";
import { DrawingMenu } from "../ui/DrawingMenu";
import { RemoteCursors } from "../ui/cursors/RemoteCursors";

import type { Camera } from "../camera/Camera";
import type { Tool } from "../types/Tool";
import type { RemotePresence } from "../network/presence/RemotePresence";

import type { Laser } from "@common/shapes";
import type { BoardObject } from "@common/types";

import "./Whiteboard.css";
import { getObjectPropertiesForType } from "../objects/getObjectProperties";
import { penProperties } from "../ui/penProperties";
import { renderSelectionRectangle } from "../rendering/renderSelectionRectangle";


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
  const [username, setUsername] = useState("");

  const [showDrawingMenu, setShowDrawingMenu] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showShapeSettings, setShowShapeSettings] = useState(false);
  const [shapeSettings, setShapeSettings] = useState({
    fill: DEFAULT_FILL,
    stroke: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    background: "#FEF3C7",
  });

  const [shapeType, setShapeType] =
    useState<BoardObject["type"] | null>(null);

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

  const [, setSelectedObjectIds] =
    useState<string[]>([]);

  const selectedObjectIdsRef =
    useRef<string[]>([]);


  const shapeProperties = useMemo(() => {
    if (!shapeType) {
      return [];
    }

    return getObjectPropertiesForType(shapeType);
  }, [shapeType]);

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

    const interaction = interactionRef.current;

    // Render the drag-selection rectangle exactly once.
    if (interaction.type === "selecting") {
      renderSelectionRectangle(
        context,
        interaction.start,
        interaction.current,
        camera,
      );
    }

    const selectedObjects =
      selectedObjectIdsRef.current
        .map(id =>
          getObjectById(
            document.objectsRef.current,
            id,
          )
        )
        .filter(
          (object): object is BoardObject =>
            object !== undefined
        );

    const currentUser = getCurrentUser();

    if (currentUser) {
      for (const object of selectedObjects) {
        let renderedObject = object;

        // REMOVE the old interaction.type === "selecting"
        // renderSelectionRectangle block from here.

        if (interaction.type === "moving") {
          const preview = interaction.preview.find(
            previewObject => previewObject.id === object.id
          );

          if (preview) {
            renderedObject = preview;
          }
        }

        if (
          interaction.type === "rotating" &&
          interaction.preview.id === object.id
        ) {
          renderedObject = interaction.preview;
        }

        if (interaction.type === "moving") {
          const preview = interaction.preview.find(
            previewObject => previewObject.id === object.id
          );

          if (preview) {
            renderedObject = preview;
          }
        }

        if (
          interaction.type === "rotating" &&
          interaction.preview.id === object.id
        ) {
          renderedObject = interaction.preview;
        }

        for (const presence of remotePresence.current.values()) {
          const previewedObject = getRenderedObject(
            object,
            presence,
          );

          if (previewedObject !== object) {
            renderedObject = previewedObject;
            break;
          }
        }

        const isPrimarySelection =
          object.id === selectedObjectIdRef.current;

        renderSelection(
          context,
          renderedObject,
          camera,
          currentUser.color,
          isPrimarySelection,
        );
      }
    }

    for (const [userId, presence] of remotePresence.current) {

      if (presence.selectedObjectIds.length === 0) {
        continue;
      }

      const user = document.usersRef.current.find(
        user => user.userId === userId
      );

      if (!user) {
        continue;
      }

      for (const objectId of presence.selectedObjectIds) {

        const object = getObjectById(
          document.objectsRef.current,
          objectId,
        );

        if (!object) {
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

        // console.log("COLLABORATION COMMAND RECEIVED:", command);
        editor.execute(
          command,
          {
            broadcast: false,
            recordHistory: false,
          }
        );

        // console.log(
        //   "OBJECT AFTER REMOTE COMMAND:",
        //   document.objectsRef.current.find(
        //     object =>
        //       object.id ===
        //       (
        //         command.type === "createBoardObject"
        //           ? command.boardObject.id
        //           : command.type === "updateBoardObject"
        //             ? command.boardObjectId
        //             : ""
        //       )
        //   )
        // );

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

    selectedObjectIdsRef,
    setSelectedObjectIds,

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
    const name = username.trim();

    if (!name) {
      return;
    }

    setLobbyState("creating");

    collaboration.createBoard(
      name,
      (boardState) => {
        setBoardId(boardState.boardId);
        setNetworkBoardId(boardState.boardId);

        document.load(
          boardState.objects,
          boardState.users,
        );

        editor.resetHistory();

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
              for (const objectPreview of command.objects) {
                if (
                  objectPreview.boardObjectId === selectedObjectIdRef.current
                ) {
                  selectedObjectIdRef.current = null;
                  setSelectedObjectId(null);
                }

                const preview: PreviewData = {
                  type: "update",
                  objectId: objectPreview.boardObjectId,
                  updates: objectPreview.updates,
                };

                const existingIndex = userPresence.previews.findIndex(
                  existingPreview =>
                    existingPreview.type === "update" &&
                    existingPreview.objectId === objectPreview.boardObjectId
                );

                if (existingIndex === -1) {
                  userPresence.previews.push(preview);
                } else {
                  userPresence.previews[existingIndex] = preview;
                }
              }

              userPresence.preview =
                userPresence.previews[
                userPresence.previews.length - 1
                ];
            }

            if (command.previewType === "clear") {
              userPresence.preview = undefined;
              userPresence.previews = [];
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

            const remoteSelectedIds = command.objectIds;

            // If the remote user selected any of my currently selected objects,
            // I need to give up those objects.
            const conflictingIds =
              remoteSelectedIds.filter(id =>
                selectedObjectIdsRef.current.includes(id)
              );

            if (conflictingIds.length > 0) {

              const nextSelectedIds =
                selectedObjectIdsRef.current.filter(
                  id => !remoteSelectedIds.includes(id)
                );

              selectedObjectIdsRef.current = nextSelectedIds;
              setSelectedObjectIds(nextSelectedIds);

              // Keep the primary selection valid.
              if (
                selectedObjectIdRef.current &&
                remoteSelectedIds.includes(selectedObjectIdRef.current)
              ) {
                const nextPrimaryId =
                  nextSelectedIds[0] ?? null;

                selectedObjectIdRef.current = nextPrimaryId;
                setSelectedObjectId(nextPrimaryId);
              }

              // Stop interactions involving objects that were taken
              // by the remote user.
              if (interaction.type === "moving") {
                const hasConflict = interaction.objectIds.some(
                  id => remoteSelectedIds.includes(id)
                );

                if (hasConflict) {
                  interactionRef.current = {
                    type: "idle",
                  };
                }
              }

              if (
                interaction.type === "resizing" &&
                remoteSelectedIds.includes(interaction.objectId)
              ) {
                interactionRef.current = {
                  type: "idle",
                };
              }

              // Tell everyone about our updated selection.
              presence.send({
                type: "selection",
                objectIds: nextSelectedIds,
              });
            }

            const userPresence =
              remotePresence.current.get(userId)
              ?? createRemotePresence();

            userPresence.selectedObjectIds = remoteSelectedIds;

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
                // console.log("LASER NOT FOUND FOR POINT", {
                //   laserId: command.laserId,
                //   lasers: userPresence.lasers,
                // });
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
    const name = username.trim();

    if (!name || !boardId.trim()) {
      return;
    }

    setLobbyState("joining");

    collaboration.joinBoard(
      boardId.trim(),
      name,
      (boardState) => {
        setBoardId(boardState.boardId);
        setNetworkBoardId(boardState.boardId);

        document.load(
          boardState.objects,
          boardState.users,
        );

        editor.resetHistory();

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

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      // Ignore shortcuts while lobby modal is open
      if (lobbyState !== "connected") {
        return;
      }

      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (!/^[0-9]$/.test(event.key)) {
        return;
      }

      const index =
        event.key === "0"
          ? 9
          : Number(event.key) - 1;

      // -------------------------
      // Shape menu
      // -------------------------

      if (showShapeMenu) {
        const shapes = [
          "rectangle",
          "triangle",
          "circle",
          "arrow",
          "textbox",
          "text",
        ] as const;

        const shape = shapes[index];

        if (!shape) {
          return;
        }

        setTool(shape);
        setShapeType(shape);
        setShowShapeMenu(false);
        setShowShapeSettings(true);

        return;
      }

      // -------------------------
      // Drawing menu
      // -------------------------

      if (showDrawingMenu) {
        const drawingTools: Tool[] = [
          "stroke",
          "laser",
        ];

        const drawingTool = drawingTools[index];

        if (!drawingTool) {
          return;
        }

        setTool(drawingTool);
        setShowDrawingMenu(false);
        setShowShapeSettings(false);

        return;
      }

      // -------------------------
      // Bottom toolbar
      // -------------------------

      switch (event.key) {
        case "1":
          selectTool("pan");
          break;

        case "2":
          selectTool("select");
          break;

        case "3":
          openDrawingMenu();
          break;

        case "4":
          openShapeMenu();
          break;
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [
    lobbyState,
    showDrawingMenu,
    showShapeMenu,
    showShapeSettings,
  ]);


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
        username={username}
        onUsernameChange={setUsername}
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

            if (tool === "stroke") {
              setShowShapeSettings(true);
            } else {
              setShowShapeSettings(false);
            }
          }}
          showShortcuts={true}
        />
      )}

      {showShapeMenu && (
        <ShapeMenu
          onSelectShape={(tool) => {
            setTool(tool);
            setShapeType(tool);
            setShowShapeMenu(false);
            setShowShapeSettings(true);
          }}
          showShortcuts={true}
        />
      )}

      {showShapeSettings && tool === "stroke" && (
        <ShapeSettings
          properties={penProperties}
          values={shapeSettings}
          onChange={(key, value) => {
            setShapeSettings(prev => ({
              ...prev,
              [key]: value,
            }));
          }}
        />
      )}

      {showShapeSettings && shapeType && tool !== "stroke" && (
        <ShapeSettings
          properties={shapeProperties}
          values={shapeSettings}
          onChange={(key, value) => {
            setShapeSettings(prev => ({
              ...prev,
              [key]: value,
            }));
          }}
        />
      )}

      <BottomToolbar
        tool={tool}
        setTool={setTool}
        onShapeClick={openShapeMenu}
        onDrawingClick={openDrawingMenu}
        showShortcuts={
          !showDrawingMenu &&
          !showShapeMenu
        }
      />
      {selectedObjectId && (
        // <ObjectInspector editor={editor} />
        <ObjectInspector object={selectedObject} editor={editor} />

      )}

      {showCoordinates && mouseWorld && (
        <div className="coordinates-overlay">
          <div>x: {mouseWorld.x.toFixed(2)}</div>
          <div>y: {mouseWorld.y.toFixed(2)}</div>
          <div className="coordinates-board-id-row">
            <span>Board ID: {boardId || "none"}</span>

            {boardId && (
              <button
                className="coordinates-copy-button"
                onClick={() => navigator.clipboard.writeText(boardId)}
                title="Copy Board ID"
                type="button"
              >
                ⧉
              </button>
            )}
          </div>
        </div>

      )}

    </div>
  )
}

export default Whiteboard
