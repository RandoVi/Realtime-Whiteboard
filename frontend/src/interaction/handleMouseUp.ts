import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import { handleDrawingMouseUp } from "./drawing/finish"
import { handleResizeMouseUp } from "./resizing/finish"
import type { Editor } from "../editor/Editor"
import { handleMovingObjectMouseUp } from "./moving/finish"
import { handlePanMouseUp } from "./panning/finish"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
}

// Handles the mouse up event for various interactions
export function handleMouseUp({
  interactionRef,
  editor,
}: Args) {

  const interaction = interactionRef.current

  switch (interaction.type) {

    case "drawing":
      handleDrawingMouseUp({
        interactionRef,
        editor,
      })
      break

    case "moving":
      handleMovingObjectMouseUp({
        interactionRef,
      })
      break

    case "resizing":
      handleResizeMouseUp({
        interactionRef,
      })
      break

    case "panning":
      handlePanMouseUp({
        interactionRef,
      })
      break
  }
}