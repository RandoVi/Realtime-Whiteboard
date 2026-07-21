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

  const shape = getSelectedShape()

  if (!shape) {
    return false
  }


  const dx =
    world.x - interaction.start.x

  const dy =
    world.y - interaction.start.y


  editor.execute(
    {
      type: "updateShape",

      shapeId: shape.id,

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