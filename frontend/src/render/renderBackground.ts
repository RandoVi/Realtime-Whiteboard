import { DEFAULT_BACKGROUND_COLOR } from "../objects/defaults"


type Viewport = {
  width: number
  height: number
}

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport
) {
  const { width, height } = viewport

  ctx.fillStyle = DEFAULT_BACKGROUND_COLOR
  ctx.fillRect(0, 0, width, height)
}