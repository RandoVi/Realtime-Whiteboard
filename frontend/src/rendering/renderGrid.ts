import { screenToWorld } from "../camera/Camera";
import type { Camera } from "../camera/Camera";
type Viewport = {
  width: number
  height: number
}

const GRID_SPACING = 50;
const CROSS_SIZE = 3;

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  viewport: Viewport
) {
  const { width, height } = viewport;

  const topLeft = screenToWorld({ x: 0, y: 0 }, camera);
  const bottomRight = screenToWorld({ x: width, y: height }, camera);

  const startX = Math.floor(topLeft.x / GRID_SPACING) * GRID_SPACING;
  const endX = Math.ceil(bottomRight.x / GRID_SPACING) * GRID_SPACING;
  const startY = Math.floor(topLeft.y / GRID_SPACING) * GRID_SPACING;
  const endY = Math.ceil(bottomRight.y / GRID_SPACING) * GRID_SPACING;

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#afafaf';

  ctx.beginPath();

  for (let x = startX; x <= endX; x += GRID_SPACING) {
    const screenX = x * camera.scale + camera.offsetX;

    for (let y = startY; y <= endY; y += GRID_SPACING) {
      const screenY = y * camera.scale + camera.offsetY;

      const cameraCrossSize = CROSS_SIZE * camera.scale; 

      ctx.moveTo(screenX - cameraCrossSize, screenY);
      ctx.lineTo(screenX + cameraCrossSize, screenY);

      ctx.moveTo(screenX, screenY - cameraCrossSize);
      ctx.lineTo(screenX, screenY + cameraCrossSize);
    }
  }

  ctx.stroke();

  // TODO axes to toggleable

  // const origin = worldToScreen({ x: 0, y: 0 }, camera);

  // if (origin.x >= 0 && origin.x <= width) {
  //   ctx.strokeStyle = '#07060a';
  //   ctx.beginPath();
  //   ctx.moveTo(origin.x, 0);
  //   ctx.lineTo(origin.x, height);
  //   ctx.stroke();
  // }

  // if (origin.y >= 0 && origin.y <= height) {
  //   ctx.strokeStyle = '#0a0606';
  //   ctx.beginPath();
  //   ctx.moveTo(0, origin.y);
  //   ctx.lineTo(width, origin.y);
  //   ctx.stroke();
  // }
}