import type { Tool } from "../types/Tool";
import { LaserIcon } from "./icons/LaserIcon";
import PencilIcon from "./icons/PencilIcon";

type Props = {
  onSelectTool: (tool: Tool) => void;
};

export function DrawingMenu({ onSelectTool }: Props) {
  return (
    <div className="drawing-menu">
      <button
        className="tool-button"
        onClick={() => onSelectTool("stroke")}
      >
        <PencilIcon color="purple" />
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectTool("laser")}
      >
        <LaserIcon color="purple" />
      </button>
    </div>
  );
}