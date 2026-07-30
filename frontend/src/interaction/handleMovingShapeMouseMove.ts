import type { MutableRefObject } from "react"

import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"


import type { Shape } from "../types/Shape"
import type { Editor } from "../editor/Editor"

type Args = {
  world: Point
  interactionRef: MutableRefObject<Interaction>
  getSelectedShape: () => Shape | undefined
  editor: Editor
}

export function handleMovingShapeMouseMove({
  world,
  interactionRef,
  getSelectedShape,
  editor,
}: Args) {

  const interaction = interactionRef.current

  if (interaction.type !== "movingShape") {
    return false
  }

  const boardObject = getSelectedShape()

  if (!boardObject) {
    return false
  }


  const dx =
    world.x - interaction.start.x

  const dy =
    world.y - interaction.start.y
  //just to avoid unnecessary updates when the mouse is moved a little bit(jitter)
  if (!interaction.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
    interaction.moved = true;
  }

  editor.execute(
    {
      type: "updateBoardObject",

      boardObjectId: boardObject.id,

      updates: {
        x: interaction.original.x + dx,
        y: interaction.original.y + dy,
      },
    },
    {
      broadcast: false,

    }

  );


  return true
}