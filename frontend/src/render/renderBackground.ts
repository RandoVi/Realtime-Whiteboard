

type Viewport = {
  width: number
  height: number
}

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport
) {
  const { width, height } = viewport

  ctx.fillStyle = '#e3e3e3'
  ctx.fillRect(0, 0, width, height)
}