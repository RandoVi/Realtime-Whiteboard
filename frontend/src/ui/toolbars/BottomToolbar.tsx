import type { Tool } from '../../types/Tool'
import './Toolbar.css'
import MoveIcon from '../icons/MoveIcon'
import SelectorIcon from '../icons/SelectorIcon'
import PencilIcon from '../icons/PencilIcon'
import ShapesIcon from '../icons/ShapesIcon'

type Props = {
  tool: Tool
  setTool: (tool: Tool) => void
  onShapeClick?: () => void
  onDrawingClick?: () => void;
}
export function BottomToolbar({
  tool,
  setTool,
  onShapeClick,
  onDrawingClick,
}: Props) {
  return (
    <div className="bottom-toolbar">

      <button
        className="tool-button"
        onClick={() => setTool("pan")}
      >
        <MoveIcon color="none" />
      </button>

      <button
        className="tool-button"
        onClick={() => setTool("select")}
      >
        <SelectorIcon color="purple" />
      </button>

      <button
        className="tool-button"
        onClick={onDrawingClick}
      >
        <PencilIcon color="purple" />
      </button>

      <button
        className="tool-button"
        onClick={onShapeClick}
      >
        <ShapesIcon color="none" />
      </button>

    </div>
  );
}