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
}

export function BottomToolbar({
  setTool,
  onShapeClick,
  onDrawingClick,
  showShortcuts = true,
}: Props) {
  return (
    <div className="bottom-toolbar">

      <button
        className="tool-button"
        onClick={() => setTool("pan")}
      >
        <MoveIcon color="none" />

        {showShortcuts && (
          <ShortcutHint shortcut="1" />
        )}
      </button>

      <button
        className="tool-button"
        onClick={() => setTool("select")}
      >
        <SelectorIcon color="purple" />

        {showShortcuts && (
          <ShortcutHint shortcut="2" />
        )}
      </button>

      <button
        className="tool-button"
        onClick={onDrawingClick}
      >
        <PencilIcon color="purple" />

        {showShortcuts && (
          <ShortcutHint shortcut="3" />
        )}
      </button>

      <button
        className="tool-button"
        onClick={onShapeClick}
      >
        <ShapesIcon color="none" />

        {showShortcuts && (
          <ShortcutHint shortcut="4" />
        )}
      </button>

    </div>
  );
}