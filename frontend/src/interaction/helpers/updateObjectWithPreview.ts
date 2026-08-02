import type { Editor } from "../../editor/Editor";
import type { Presence } from "../../socket/preview/Presence";
import type { ObjectUpdate } from "../../types/ObjectUpdate";

type Args = {
    editor: Editor;
    presence: Presence;
    objectId: string;
    updates: ObjectUpdate;
};

export function updateObjectWithPreview({
    editor,
    presence,
    objectId,
    updates,
}: Args) {

    editor.execute(
        {
            type: "updateBoardObject",
            boardObjectId: objectId,
            updates,
        },
        {
            broadcast: false,
        }
    );

    presence.send({
        type: "objectPreview",
        previewType: "update",
        boardObjectId: objectId,
        updates,
    });
}