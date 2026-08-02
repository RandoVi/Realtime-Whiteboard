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
    │   └── commands/
    ├── history/
    ├── hooks/
    │   ├── useCanvasResize.ts
    │   └── useWhiteboardInput.ts
    ├── interaction/
    │   ├── handleDrawingMouseDown.ts
    │   ├── handleDrawingMouseMove.ts
    │   ├── handleDrawingMouseUp.ts
    │   ├── handleKeyDown.ts
    │   ├── handleMouseUp.ts
    │   ├── handleMovingObjectMouseMove.ts
    │   ├── handleMovingObjectMouseUp.ts
    │   ├── handlePanMouseDown.ts
    │   ├── handlePanMouseMove.ts
    │   ├── handleResizeMouseMove.ts
    │   ├── handleResizeMouseUp.ts
    │   ├── handleSelectionClearMouseDown.ts
    │   ├── handleSelectionMouseDown.ts
    │   ├── handleSelectionMouseMove.ts
    │   ├── handleSelectionMoveMouseDown.ts
    │   ├── handleSelectionResizeMouseDown.ts
    │   ├── handleZoom.ts
    │   └── helpers/
    ├── lobby/
    │   └── BoardLobbyModal.tsx
    ├── network/
    │   ├── NetworkCommand.ts
    │   ├── board.ts
    │   ├── client.ts
    │   └── events.ts
    ├── objects/
    │   ├── Circle.ts
    │   ├── Rectangle.ts
    │   ├── Stroke.ts
    │   ├── createObject.ts
    │   ├── getObjectById.ts
    │   ├── hitTestHandle.ts
    │   ├── hitTestObject.ts
    │   ├── moveObject.ts
    │   ├── normalizeObject.ts
    │   ├── normalizeRectangle.ts
    │   ├── resizeCircle.ts
    │   ├── resizeObject.ts
    │   ├── resizeRectangle.ts
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
    │   └── preview/
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
    │   └── objectPanel/
    └── whiteboard/
        ├── Whiteboard.tsx
        └── Whiteboard.css
```

## Current structure notes

- `src/main.tsx` mounts the `whiteboard/Whiteboard.tsx` entry component.
- `whiteboard/` contains the top-level canvas and board UI.
- `editor/` and `document/` hold editor and document orchestration logic.
- `objects/`, `render/`, `selection/`, and `interaction/` hold the core drawing and manipulation pipeline.
- `socket/`, `network/`, and `lobby/` handle collaboration and board/session communication.
- `ui/` contains shared interface pieces such as the toolbar, object panel, and icons.
- `types/`, `hooks/`, and `camera/` contain shared utilities and primitives.
```