export type Point = {
  x: number
  y: number
}

export type Camera = {
  scale: number
  offsetX: number
  offsetY: number
}

export type UseWhiteboardInputResult = {
  showCoordinates: boolean
  mouseWorld: Point | null
  bindCanvas: (canvas: HTMLCanvasElement | null) => void
}

export type Props = {
  cameraRef: React.RefObject<Camera>
  viewportRef: React.RefObject<{ width: number; height: number; dpr: number }>
  requestRender: () => void
}