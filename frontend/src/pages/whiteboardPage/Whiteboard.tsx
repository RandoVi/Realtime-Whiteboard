import { useEffect, useRef, useState } from 'react'
import type { Camera } from './Types'
import { renderGrid } from './render/renderGrid'
import { renderBackground } from './render/renderBackground'
import { useWhiteboardInput } from './hooks/useWhiteboardInput'
import type { Shape } from './shapes/Shape'
import { renderShapes } from './render/RenderShapes'
import './Whiteboard.css'

import { BottomToolbar } from './ui/toolbar/BottomToolbar'
import { LeftToolbar } from './ui/toolbar/LeftToolbar'
import type { Tool } from './tools/Tool'


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

  const shapesRef = useRef<Shape[]>([
  {
    id: crypto.randomUUID(),
    type: 'rectangle',

    x: -100,
    y: -75,

    width: 200,
    height: 150,

    fill: '#90caf9',
    stroke: '#1565c0',
  },
])

const [tool, setTool] = useState<Tool>('pan')
const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
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
      shapesRef.current,
      camera,
      previewShapeRef.current,
      selectedShapeIdRef.current
    )

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

  const {
    showCoordinates,
    mouseWorld,
    bindCanvas,
    previewShapeRef,
  } = useWhiteboardInput({
    cameraRef: transformRef,
    viewportRef,
    requestRender,
    shapesRef,
    tool,
    selectedShapeId,
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

  return (
    <div className='whiteboard-page'>
      <canvas
        ref={(canvas) => {
          canvasRef.current = canvas
          bindCanvas(canvas)
        }}
        className="whiteboard-canvas"
      />
      <LeftToolbar />
      <BottomToolbar
        tool={tool}
        setTool={setTool}
      />

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
