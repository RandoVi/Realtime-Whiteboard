import { useEffect, useRef } from 'react'
import type { Camera } from './Types'
import { renderGrid } from './renderGrid'
import { renderBackground } from './renderBackground'
import { useWhiteboardInput } from './useWhiteboardInput'
import './Whiteboard.css'

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

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



  const render = () => {
    const canvas = canvasRef.current
    console.log("render");

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

  }

  const requestRender = () => {
    console.log(renderFrameRef.current)
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
  } = useWhiteboardInput({
    cameraRef: transformRef,
    viewportRef,
    requestRender,
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
      <button style={{ position: "absolute", top: 10, left: 10, backgroundColor: "blue", color: "white", padding: 10, borderRadius: 5, border: "none", cursor: "pointer" }}
        onClick={() => {
          socket.emit("ping", {
            message: "Hello backend",
          });
        }}
      >
        Send
      </button>
      <canvas
        ref={(canvas) => {
          canvasRef.current = canvas
          bindCanvas(canvas)
        }}
        className="whiteboard-canvas"
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
