import { CircleIcon } from "./icons/CircleIcon";
import { LeftArrowIcon } from "./icons/LeftArrowIcon";
import { RectangleIcon } from "./icons/RectangleIcon";
import { StickyNoteIcon } from "./icons/StickyNoteIcon";
import { TriangleIcon } from "./icons/TriangleIcon";
import { ShortcutHint } from "./ShortcutHint";

export type ShapeTool =
  | "rectangle"
  | "triangle"
  | "circle"
  | "arrow"
  | "textbox"
  | "text";
  

type Props = {
  onSelectShape: (tool: ShapeTool) => void;
  showShortcuts?: boolean;
};

export function ShapeMenu({
  onSelectShape,
  showShortcuts = true,
}: Props) {
  return (
    <div className="shape-menu">

      <button
        className="tool-button"
        onClick={() => onSelectShape("rectangle")}
      >
        <RectangleIcon />
        {showShortcuts && <ShortcutHint shortcut="1" />}
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectShape("triangle")}
      >
        <TriangleIcon color="purple" />
        {showShortcuts && <ShortcutHint shortcut="2" />}
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectShape("circle")}
      >
        <CircleIcon />
        {showShortcuts && <ShortcutHint shortcut="3" />}
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectShape("arrow")}
      >
        <LeftArrowIcon />
        {showShortcuts && <ShortcutHint shortcut="4" />}
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectShape("textbox")}
      >
        <StickyNoteIcon />
        {showShortcuts && <ShortcutHint shortcut="5" />}
      </button>

            <button
        className="tool-button"
        onClick={() => onSelectShape("text")}
      >
        <StickyNoteIcon />
        {showShortcuts && <ShortcutHint shortcut="5" />}
      </button>

    </div>
  );
}