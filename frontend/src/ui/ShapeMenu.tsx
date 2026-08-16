import type { Tool } from "../types/Tool";
import { CircleIcon } from "./icons/CircleIcon";
import { LeftArrowIcon } from "./icons/LeftArrowIcon";
import {RectangleIcon} from "./icons/RectangleIcon";
import { StickyNoteIcon } from "./icons/StickyNoteIcon";
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
        <RectangleIcon />
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

            <button
        className="tool-button"
        onClick={() => onSelectShape("arrow")}
      >
        <LeftArrowIcon />
      </button>

                  <button
        className="tool-button"
        onClick={() => onSelectShape("textbox")}
      >
        <StickyNoteIcon />
      </button>
    </div>
  );
}