# Frontend Project Architecture

This file documents the current frontend structure as it exists in the repository.

Generated dependencies under `frontend/node_modules/` are intentionally omitted from the tree below.

```text
frontend/
├── .gitignore
├── .oxlintrc.json
├── dist/
│   ├── assets/
│   │   ├── index-BpasZp-n.css
│   │   └── index-Bt0lWM6F.js
│   ├── favicon.svg
│   ├── icons.svg
│   └── index.html
├── index.html
├── package-lock.json
├── package.json
├── project-architecture.md
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── README.md
├── src/
│   ├── camera/
│   │   └── Camera.ts
│   ├── document/
│   │   ├── createDocument.ts
│   │   ├── Document.ts
│   │   └── DocumentCommand.ts
│   ├── editor/
│   │   ├── commands/
│   │   │   ├── createObject.ts
│   │   │   ├── deleteObject.ts
│   │   │   └── updateObject.ts
│   │   ├── createEditor.ts
│   │   ├── duplicateObject.ts
│   │   ├── Editor.ts
│   │   └── EditorCommand.ts
│   ├── hooks/
│   │   ├── useCanvasResize.ts
│   │   └── useWhiteboardInput.ts
│   ├── index.css
│   ├── interaction/
│   │   ├── CanvasInteractionContext.ts
│   │   ├── drawing/
│   │   │   ├── beginDrawing.ts
│   │   │   ├── finishDrawing.ts
│   │   │   └── updateDrawing.ts
│   │   ├── handleKeyDown.ts
│   │   ├── handleMouseDown.ts
│   │   ├── handleMouseMove.ts
│   │   ├── handleMouseUp.ts
│   │   ├── handleSelectMouseDown.ts
│   │   ├── handleZoom.ts
│   │   ├── helpers/
│   │   │   ├── getObjectMoveUpdates.ts
│   │   │   ├── getObjectResizeUpdates.ts
│   │   │   ├── getPointer.ts
│   │   │   ├── resetInteraction.ts
│   │   │   └── updateObjectWithPreview.ts
│   │   ├── Interaction.ts
│   │   ├── moving/
│   │   │   ├── beginMoving.ts
│   │   │   ├── finishMoving.ts
│   │   │   └── updateMove.ts
│   │   ├── panning/
│   │   │   ├── beginPan.ts
│   │   │   ├── finishPan.ts
│   │   │   └── updatePan.ts
│   │   ├── resizing/
│   │   │   ├── beginResize.ts
│   │   │   ├── finishResize.ts
│   │   │   └── updateResize.ts
│   │   └── selection/
│   │       └── clearSelection.ts
│   ├── lobby/
│   │   ├── BoardLobbyModal.css
│   │   └── BoardLobbyModal.tsx
│   ├── main.tsx
│   ├── network/
│   │   ├── board.ts
│   │   ├── client.ts
│   │   ├── events.ts
│   │   └── NetworkCommand.ts
│   ├── objects/
│   │   ├── arrow/
│   │   │   ├── arrowHandler.ts
│   │   │   ├── Arrow.ts
│   │   │   ├── createArrow.ts
│   │   │   ├── duplicateArrow.ts
│   │   │   ├── getArrowBounds.ts
│   │   │   ├── getArrowMoveUpdates.ts
│   │   │   ├── getArrowResizeUpdates.ts
│   │   │   ├── hitTestArrow.ts
│   │   │   ├── moveArrow.ts
│   │   │   ├── normalizeArrow.ts
│   │   │   ├── renderArrow.ts
│   │   │   ├── resizeArrow.ts
│   │   │   └── updateArrowPreview.ts
│   │   ├── circle/
│   │   │   ├── circleHandler.ts
│   │   │   ├── Circle.ts
│   │   │   ├── createCircle.ts
│   │   │   ├── duplicateCircle.ts
│   │   │   ├── getCircleBounds.ts
│   │   │   ├── getCircleMoveUpdates.ts
│   │   │   ├── getCircleResizeUpdates.ts
│   │   │   ├── getResizeHandleCircle.ts
│   │   │   ├── hitTestCircle.ts
│   │   │   ├── moveCircle.ts
│   │   │   ├── renderCircle.ts
│   │   │   ├── resizeCircle.ts
│   │   │   └── updateCirclePreview.ts
│   │   ├── createObject.ts
│   │   ├── defaults.ts
│   │   ├── getObjectById.ts
│   │   ├── getObjectProperties.ts
│   │   ├── getTopObjectAtPoint.ts
│   │   ├── hitTestHandle.ts
│   │   ├── hitTestObject.ts
│   │   ├── moveObject.ts
│   │   ├── normalizeObject.ts
│   │   ├── objectFolderStructure.MD
│   │   ├── properties/
│   │   │   └── ObjectProperty.ts
│   │   ├── rectangle/
│   │   │   ├── duplicateRectangle.ts
│   │   │   ├── getRectangleBounds.ts
│   │   │   ├── getRectangleMoveUpdates.ts
│   │   │   ├── getRectangleResizeUpdates.ts
│   │   │   ├── getResizeHandleRectangle.ts
│   │   │   ├── hitTestRectangle.ts
│   │   │   ├── moveRectangle.ts
│   │   │   ├── normalizeRectangle.ts
│   │   │   ├── rectangleHandler.ts
│   │   │   ├── Rectangle.ts
│   │   │   ├── createRectangle.ts
│   │   │   ├── renderRectangle.ts
│   │   │   ├── resizeRectangle.ts
│   │   │   └── updateRectanglePreview.ts
│   │   ├── registry/
│   │   │   ├── getObjectHandler.ts
│   │   │   ├── ObjectHandler.ts
│   │   │   ├── objectFactories.ts
│   │   │   └── objectHandlers.ts
│   │   ├── resizeObject.ts
│   │   ├── stroke/
│   │   │   ├── duplicateStroke.ts
│   │   │   ├── getStrokeMoveUpdates.ts
│   │   │   ├── moveStroke.ts
│   │   │   ├── renderStroke.ts
│   │   │   ├── strokeHandler.ts
│   │   │   ├── Stroke.ts
│   │   │   ├── createStroke.ts
│   │   │   └── updateStrokePreview.ts
│   │   ├── triangle/
│   │   │   ├── triangleHandler.ts
│   │   │   ├── Triangle.ts
│   │   │   ├── createTriangle.ts
│   │   │   ├── duplicateTriangle.ts
│   │   │   ├── getTriangleBounds.ts
│   │   │   ├── getTriangleMoveUpdates.ts
│   │   │   ├── getTriangleResizeUpdates.ts
│   │   │   ├── hitTestTriangle.ts
│   │   │   ├── moveTriangle.ts
│   │   │   ├── renderTriangle.ts
│   │   │   ├── resizeTriangle.ts
│   │   │   └── updateTrianglePreview.ts
│   │   └── updatePreviewObject.ts
│   ├── render/
│   │   ├── renderBackground.ts
│   │   ├── renderGrid.ts
│   │   ├── renderObjects.ts
│   │   └── renderSelection.ts
│   ├── selection/
│   │   ├── getResizeHandleForObject.ts
│   │   ├── getResizeHandles.ts
│   │   ├── getSelectionBounds.ts
│   │   ├── getSelectionCursor.ts
│   │   ├── getSelectionHandle.ts
│   │   └── hitTestResizeHandles.ts
│   ├── socket/
│   │   ├── collaboration/
│   │   │   ├── BoardStateDTO.ts
│   │   │   ├── Collaboration.ts
│   │   │   ├── localCollaboration.ts
│   │   │   ├── NoopCollaboration.ts
│   │   │   ├── SocketCollaboration.ts
│   │   │   └── useCollaboration.ts
│   │   ├── preview/
│   │   │   ├── Presence.ts
│   │   │   ├── PresenceCommand.ts
│   │   │   └── SocketPresence.ts
│   │   └── SocketClient.ts
│   ├── types/
│   │   ├── Object.ts
│   │   ├── ObjectUpdate.ts
│   │   ├── selection.ts
│   │   ├── Tool.ts
│   │   └── Types.tsx
│   ├── ui/
│   │   ├── BottomToolbar.tsx
│   │   ├── icons/
│   │   │   ├── CursorIcon.tsx
│   │   │   ├── MoveIcon.tsx
│   │   │   ├── PencilIcon.tsx
│   │   │   ├── RectangleIcon.tsx
│   │   │   └── SelectorIcon.tsx
│   │   ├── ObjectPanel.tsx
│   │   ├── objectPanel/
│   │   │   ├── ActionsSection.tsx
│   │   │   ├── LayerSection.tsx
│   │   │   ├── ObjectInspector.css
│   │   │   ├── ObjectInspector.tsx
│   │   │   ├── PropertyInput.tsx
│   │   │   ├── PropertyRow.tsx
│   │   │   └── PropertySection.tsx
│   │   └── Toolbar.css
│   └── whiteboard/
│       ├── Whiteboard.css
│       └── Whiteboard.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Current structure notes

- `src/main.tsx` mounts the `whiteboard/Whiteboard.tsx` entry component.
- `whiteboard/` contains the top-level board UI and canvas shell.
- `editor/` and `document/` handle editor/document state and command orchestration.
- `objects/`, `render/`, `selection/`, and `interaction/` form the core drawing and manipulation pipeline.
- `socket/`, `network/`, and `lobby/` handle collaboration and board/session communication.
- `ui/` contains shared interface pieces such as the toolbar, object panel, and icons.
- `types/`, `hooks/`, and `camera/` provide shared utilities and primitives.