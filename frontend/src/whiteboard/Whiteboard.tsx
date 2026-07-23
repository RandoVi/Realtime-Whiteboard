import { useEffect, useMemo, useRef, useState } from 'react'
import type { Camera } from '../types/Types'
import { renderGrid } from '../render/renderGrid'
import { renderBackground } from '../render/renderBackground'
import { useWhiteboardInput } from '../hooks/useWhiteboardInput'
import { renderShapes } from '../render/RenderShapes'
import './Whiteboard.css'
import { BottomToolbar } from '../ui/BottomToolbar'
import type { Tool } from '../types/Tool'
import { renderSelection } from '../render/renderSelection'
import { getShapeById } from '../shapes/getShapeById'
import { createEditor } from '../editor/createEditor'
import { ObjectInspector } from '../ui/objectPanel/ObjectInspector'
import { createDocument } from '../document/createDocument'

import { SocketCollaboration } from "../socket/collaboration/SocketCollaboration";

function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const transformRef = useRef<Camera>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 }) // dpr = device pixel ratio
  const resizeInitializedRef = useRef(false)
  const renderFrameRef = useRef<number | null>(null)
  const document = useMemo(
    () =>
      createDocument([]),
    []
  )

  const [tool, setTool] = useState<Tool>('pan')
  const [selectedShapeId, setSelectedShapeId] =
    useState<string | null>(null);
  const selectedShapeIdRef = useRef<string | null>(null)


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
    renderShapes(
      context,
      document.shapesRef.current,
      camera,
      interactionRef.current,
    )

    const selectedShape = selectedShapeIdRef.current
      ? getShapeById(
        document.shapesRef.current,
        selectedShapeIdRef.current
      )
      : undefined

    if (selectedShape) {
      renderSelection(
        context,
        selectedShape,
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

  const editor = useMemo(
    () =>
      createEditor({
        document,
        selectedShapeIdRef,
        setSelectedShapeId,
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
    editor,
    setSelectedShapeId,
    selectedShapeIdRef,
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

  const selectedShape = selectedShapeId
    ? getShapeById(document.shapesRef.current, selectedShapeId)
    : undefined

  return (
    <div className='whiteboard-page'>
      <canvas
        ref={(canvas) => {
          canvasRef.current = canvas
          bindCanvas(canvas)
        }}
        className="whiteboard-canvas"
      />
      {/* <ObjectPanel /> */}
      <BottomToolbar
        tool={tool}
        setTool={setTool}
      />
      {selectedShapeId && (
        // <ObjectInspector editor={editor} />
        <ObjectInspector shape={selectedShape} editor={editor} />

      )}

      {showCoordinates && mouseWorld && (
        <div className="coordinates-overlay">
          <div>x: {mouseWorld.x.toFixed(2)}</div>
          <div>y: {mouseWorld.y.toFixed(2)}</div>
        </div>
      )}
    </div>
  )
}

export default Whiteboard
