import type { Tool } from "../types/Tool";
import { CircleIcon } from "./icons/CircleIcon";
import PencilIcon from "./icons/PencilIcon";
import RectangleIcon from "./icons/RectangleIcon";
import { TriangleIcon } from "./icons/TriangleIcon";

type Props = {
  onSelectShape: (tool: Tool) => void;
};

export function ShapeMenu({ onSelectShape }: Props) {
  return (
    <div className="shape-menu">
      <button
        className="tool-button"
        onClick={() => onSelectShape("rectangle")}
      >
        <RectangleIcon color="purple" />
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectShape("triangle")}
      >
        <TriangleIcon color="purple" />
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectShape("circle")}
      >
        <CircleIcon />
      </button>
    </div>
  );
}