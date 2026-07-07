import { useState } from 'react'
import type { Tool } from '../../tools/Tool'
import './Toolbar.css'
import CursorIcon from './icons/CursorIcon'

  type Props = {
    tool: Tool
    setTool: (tool: Tool) => void
  }
export function BottomToolbar({
  setTool
}: Props) {



  return (
    <div className="bottom-toolbar">
  <button className="tool-button" onClick={() => setTool('rectangle')}>
    <CursorIcon color={'purple'}/>
  </button>

  <button className="tool-button" onClick={() => setTool('pan')}>
    {/* <Pencil /> */}
    <CursorIcon color={'purple'}/>
  </button>

  <button className="tool-button" onClick={() => setTool('select')}>
    {/* <Rectangle /> */}
    <CursorIcon color={'purple'}/>
  </button>

  <button className="tool-button">
    {/* <Circle /> */}
    <CursorIcon color={'purple'}/>
  </button>
    </div>
  )
}