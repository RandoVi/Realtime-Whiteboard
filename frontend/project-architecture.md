# Frontend Project Architecture

This file documents the current frontend structure as it exists in the repository.

```text
frontend/
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
└── src/
    ├── main.tsx
    ├── index.css
    ├── camera/
    │   └── Camera.ts
    ├── document/
    │   ├── createDocument.ts
    │   ├── Document.ts
    │   └── DocumentCommand.ts
    ├── editor/
    │   ├── createEditor.ts
    │   ├── Editor.ts
    │   ├── EditorCommand.ts
    │   ├── duplicateObject.ts
    │   └── commands/
    │       ├── createObject.ts
    │       ├── deleteObject.ts
    │       └── updateObject.ts
    ├── history/
    ├── hooks/
    │   ├── useCanvasResize.ts
    │   └── useWhiteboardInput.ts
    ├── interaction/
    │   ├── CanvasInteractionContext.ts
    │   ├── Interaction.ts
    │   ├── drawing/
    │   │   ├── begin.ts
    │   │   ├── finish.ts
    │   │   └── update.ts
    │   ├── events/
    │   │   ├── mouseDown.ts (no code here)
    │   │   ├── mouseMove.ts (no code here)
    │   │   ├── mouseUp.ts    (no code here)
    │   │   └── wheel.ts   (no code here)
    │   ├── helpers/
    │   │   ├── getObjectMoveUpdates.ts
    │   │   ├── getObjectResizeUpdates.ts
    │   │   ├── getPointer.ts
    │   │   └── updateObjectWithPreview.ts
    │   ├── moving/
    │   │   ├── finish.ts
    │   │   └── update.ts
    │   ├── panning/
    │   │   ├── finish.ts
    │   │   ├── handlePanMouseDown.ts 
    │   │   └── handlePanMouseMove.ts
    │   ├── resizing/
    │   │   ├── finish.ts
    │   │   └── update.ts
    │   ├── selection/
    │   │   ├── beginMove.ts
    │   │   ├── beginResize.ts
    │   │   ├── clearSelection.ts
    │   │   └── hover.ts
    │   ├── states/
    │   │   ├── createMovingInteraction.ts (no code here)
    │   │   └── createResizeInteraction.ts (no code here)
    │   ├── handleKeyDown.ts
    │   ├── handleMouseDown.ts
    │   ├── handleMouseMove.ts
    │   ├── handleMouseUp.ts
    │   ├── handleSelectionClearMouseDown.ts
    │   ├── handleSelectionMouseDown.ts
    │   ├── handleSelectionMouseMove.ts
    │   ├── handleSelectionMoveMouseDown.ts
    │   ├── handleSelectionResizeMouseDown.ts
    │   ├── handleZoom.ts
    │   └── resetInteraction.ts
    ├── lobby/
    │   └── BoardLobbyModal.tsx
    ├── network/
    │   ├── NetworkCommand.ts
    │   ├── board.ts
    │   ├── client.ts
    │   └── events.ts
    ├── objects/
    │   ├── circle/
    │   │   ├── Circle.ts
    │   │   ├── createCircle.ts
    │   │   ├── hitTestCircle.ts
    │   │   ├── moveCircle.ts
    │   │   ├── renderCircle.ts
    │   │   ├── resizeCircle.ts
    │   │   └── updateCirclePreview.ts
    │   ├── rectangle/
    │   │   ├── Rectangle.ts
    │   │   ├── createRectangle.ts
    │   │   ├── hitTestRectangle.ts
    │   │   ├── moveRectangle.ts
    │   │   ├── normalizeRectangle.ts
    │   │   ├── renderRectangle.ts
    │   │   ├── resizeRectangle.ts
    │   │   └── updateRectanglePreview.ts
    │   ├── stroke/
    │   │   ├── Stroke.ts
    │   │   ├── createStroke.ts
    │   │   ├── moveStroke.ts
    │   │   ├── renderStroke.ts
    │   │   └── updateStrokePreview.ts
    │   ├── createObject.ts
    │   ├── defaults.ts
    │   ├── getObjectById.ts
    │   ├── getTopObjectAtPoint.ts
    │   ├── hitTestHandle.ts
    │   ├── hitTestObject.ts
    │   ├── moveObject.ts
    │   ├── normalizeObject.ts
    │   ├── resizeObject.ts
    │   └── updatePreviewObject.ts
    ├── render/
    │   ├── RenderCircle.ts
    │   ├── RenderObjects.ts
    │   ├── RenderRectangle.ts
    │   ├── RenderStroke.ts
    │   ├── renderBackground.ts
    │   ├── renderGrid.ts
    │   └── renderSelection.ts
    ├── selection/
    │   ├── getResizeHandleAtPoint.ts
    │   ├── getResizeHandleForObject.ts
    │   ├── getResizeHandles.ts
    │   ├── getSelectionBounds.ts
    │   ├── getSelectionCursor.ts
    │   └── getSelectionHandle.ts
    ├── socket/
    │   ├── SocketClient.ts
    │   ├── collaboration/
    │   │   ├── BoardStateDTO.ts
    │   │   ├── Collaboration.ts
    │   │   ├── NoopCollaboration.ts
    │   │   ├── SocketCollaboration.ts
    │   │   ├── localCollaboration.ts
    │   │   └── useCollaboration.ts
    │   └── preview/
    │       ├── Presence.ts
    │       ├── PresenceCommand.ts
    │       └── SocketPresence.ts
    ├── types/
    │   ├── Object.ts
    │   ├── Tool.ts
    │   ├── Types.tsx
    │   └── selection.ts
    ├── ui/
    │   ├── BottomToolbar.tsx
    │   ├── ObjectPanel.tsx
    │   ├── Toolbar.css
    │   ├── icons/
    │   │   ├── CursorIcon.tsx
    │   │   ├── MoveIcon.tsx
    │   │   ├── PencilIcon.tsx
    │   │   ├── RectangleIcon.tsx
    │   │   └── SelectorIcon.tsx
    │   └── objectPanel/
    │       ├── ActionsSection.tsx
    │       ├── AppearanceSection.tsx
    │       ├── LayerSection.tsx
    │       ├── ObjectInspector.css
    │       ├── ObjectInspector.tsx
    │       ├── PropertyRow.tsx
    │       └── TransformSection.tsx
    └── whiteboard/
        ├── Whiteboard.tsx
        └── Whiteboard.css
```

## Current structure notes

- `src/main.tsx` mounts the `whiteboard/Whiteboard.tsx` entry component.
- `whiteboard/` contains the top-level board UI and canvas shell.
- `editor/` and `document/` handle editor/document state and command orchestration.
- `objects/`, `render/`, `selection/`, and `interaction/` form the core drawing and manipulation pipeline.
- The `interaction/` layer has been reorganized into subfolders such as `drawing/`, `moving/`, `panning/`, `resizing/`, `selection/`, `states/`, and `events/`.
- `socket/`, `network/`, and `lobby/` handle collaboration and board/session communication.
- `ui/` contains shared interface pieces such as the toolbar, object panel, and icons.
- `types/`, `hooks/`, and `camera/` provide shared utilities and primitives.
