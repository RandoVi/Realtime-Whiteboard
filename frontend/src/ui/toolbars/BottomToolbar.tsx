import type { Tool } from '../../types/Tool'
import './Toolbar.css'
import RectangleIcon from '../icons/RectangleIcon'
import MoveIcon from '../icons/MoveIcon'
import SelectorIcon from '../icons/SelectorIcon'
import PencilIcon from '../icons/PencilIcon'
import ShapesIcon from '../icons/ShapesIcon'

type Props = {
  tool: Tool
  setTool: (tool: Tool) => void
  onShapeClick?: () => void
}
export function BottomToolbar({
  setTool,
  onShapeClick
}: Props) {



  return (
    <div className="bottom-toolbar">
      <button className="tool-button" onClick={onShapeClick}>
        <RectangleIcon color={'none'} />
      </button>

      <button className="tool-button" onClick={() => setTool('shapes')}>
        <ShapesIcon color={'none'} />
      </button>

      <button className="tool-button" onClick={() => setTool('pan')}>
        {/* <Pencil /> */}
        <MoveIcon color={'none'} />
      </button>

      <button className="tool-button" onClick={() => setTool('select')}>
        {/* <Rectangle /> */}
        <SelectorIcon color={'purple'} />
      </button>

      <button className="tool-button" onClick={() => setTool('stroke')}>
        {/* <Circle /> */}
        <PencilIcon color={'purple'} />
      </button>
    </div>
  )
}