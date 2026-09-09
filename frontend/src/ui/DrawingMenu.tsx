import type { Tool } from "../types/Tool";
import { LaserIcon } from "./icons/LaserIcon";
import PencilIcon from "./icons/PencilIcon";
import { ShortcutHint } from "./ShortcutHint";

type Props = {
  onSelectTool: (tool: Tool) => void;
  showShortcuts?: boolean;
};

export function DrawingMenu({
  onSelectTool,
  showShortcuts = true,
}: Props) {
  return (
    <div className="drawing-menu">
      <button
        className="tool-button"
        onClick={() => onSelectTool("stroke")}
      >
        <PencilIcon color="purple" />

        {showShortcuts && (
          <ShortcutHint shortcut="1" />
        )}
      </button>

      <button
        className="tool-button"
        onClick={() => onSelectTool("laser")}
      >
        <LaserIcon color="purple" />

        {showShortcuts && (
          <ShortcutHint shortcut="2" />
        )}
      </button>
    </div>
  );
}