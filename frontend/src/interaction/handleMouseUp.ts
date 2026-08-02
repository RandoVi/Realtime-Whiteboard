import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Object } from "../types/Object"
import { handleDrawingMouseUp } from "./drawing/finish"
import { handleResizeMouseUp } from "./resizing/finish"
import type { Editor } from "../editor/Editor"
import { handleMovingObjectMouseUp } from "./moving/finish"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
  getSelectedObject: () => Object | undefined

}
// Handles the mouse up event for various interactions like drawing, moving, and resizing objects
export function handleMouseUp({
    interactionRef,
    getSelectedObject,
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
                getSelectedObject,
                editor,
            })
            break


        case "resizing":
            handleResizeMouseUp({
                interactionRef,
                getSelectedObject,
                editor,
            })
            break
    }
}