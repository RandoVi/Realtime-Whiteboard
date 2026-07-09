import './Toolbar.css'
import CursorIcon from './icons/CursorIcon'

export function LeftToolbar() {
  return (
    <div className="left-toolbar">
      <button className="tool-button">
        <CursorIcon color={'purple'} />
      </button>

      <button className="tool-button">
        {/* <Pencil /> */}
        <CursorIcon color={'purple'} />
      </button>

      <button className="tool-button">
        {/* <Rectangle /> */}
        <CursorIcon color={'purple'} />
      </button>

      <button className="tool-button">
        {/* <Circle /> */}
        <CursorIcon color={'purple'} />
      </button>
    </div>
  )
}