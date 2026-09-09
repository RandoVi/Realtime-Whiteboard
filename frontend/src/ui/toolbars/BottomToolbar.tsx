import type { Tool } from '../../types/Tool'
import './Toolbar.css'
import MoveIcon from '../icons/MoveIcon'
import SelectorIcon from '../icons/SelectorIcon'
import PencilIcon from '../icons/PencilIcon'
import ShapesIcon from '../icons/ShapesIcon'
import { ShortcutHint } from '../ShortcutHint'

type Props = {
  tool: Tool
  setTool: (tool: Tool) => void
  onShapeClick?: () => void
  onDrawingClick?: () => void
  showShortcuts?: boolean
  showDrawingMenu?: boolean
  showShapeMenu?: boolean
}

export function BottomToolbar({
  tool,
  setTool,
  onShapeClick,
  onDrawingClick,
  showShortcuts = true,
  showDrawingMenu = false,
  showShapeMenu = false,
}: Props) {
  return (
    <div className="bottom-toolbar">

      <button
        className={`tool-button ${!showDrawingMenu &&
            !showShapeMenu &&
            tool === "pan"
            ? "active"
            : ""
          }`}
        onClick={() => setTool("pan")}
      >
        <MoveIcon color="none" />

        {showShortcuts && (
          <ShortcutHint shortcut="1" />
        )}
      </button>

      <button
        className={`tool-button ${!showDrawingMenu &&
            !showShapeMenu &&
            tool === "select"
            ? "active"
            : ""
          }`}
        onClick={() => setTool("select")}
      >
        <SelectorIcon color="purple" />

        {showShortcuts && (
          <ShortcutHint shortcut="2" />
        )}
      </button>

      <button
        className={`tool-button ${showDrawingMenu ||
            (!showShapeMenu && isDrawingTool(tool))
            ? "active"
            : ""
          }`}
        onClick={onDrawingClick}
      >
        <PencilIcon color="purple" />

        {showShortcuts && (
          <ShortcutHint shortcut="3" />
        )}
      </button>

      <button
        className={`tool-button ${showShapeMenu ||
            (!showDrawingMenu && isShapeTool(tool))
            ? "active"
            : ""
          }`}
        onClick={onShapeClick}
      >
        <ShapesIcon color="none" />

        {showShortcuts && (
          <ShortcutHint shortcut="4" />
        )}
      </button>

    </div>
  )
}

function isDrawingTool(tool: Tool) {
  return tool === "stroke" || tool === "laser";
}

function isShapeTool(tool: Tool) {
  return (
    tool === "rectangle" ||
    tool === "triangle" ||
    tool === "circle" ||
    tool === "arrow" ||
    tool === "textbox" ||
    tool === "text"
  );
}