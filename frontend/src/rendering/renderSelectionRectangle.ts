import type { Camera } from "../camera/Camera";
import type { Point } from "@common/types";

export function renderSelectionRectangle(
  context: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  camera: Camera,
) {
  const x1 = start.x * camera.scale + camera.offsetX;
  const y1 = start.y * camera.scale + camera.offsetY;

  const x2 = end.x * camera.scale + camera.offsetX;
  const y2 = end.y * camera.scale + camera.offsetY;

  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  context.save();

  context.setLineDash([6, 4]);

  context.strokeStyle = "#2563eb";
  context.lineWidth = 1;

  context.strokeRect(
    x,
    y,
    width,
    height,
  );

  context.fillStyle = "rgba(37, 99, 235, 0.08)";

  context.fillRect(
    x,
    y,
    width,
    height,
  );

  context.restore();
}