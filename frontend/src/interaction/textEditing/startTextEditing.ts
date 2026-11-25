
import type { Textbox } from "@common/shapes/Textbox";
import type { CanvasText } from "@common/shapes/CanvasText";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";

import { TEXT_LINE_HEIGHT } from "../../objects/text/textConstants";

type EditableTextObject = Textbox | CanvasText;

type Args = {
    object: EditableTextObject;
    context: CanvasInteractionContext;
};

export function startTextEditing({
    object,
    context,
}: Args) {
    const {
        canvas,
        cameraRef,
        interactionRef,
        textEditorRef,
        editor,
        requestRender,
        selectObject,
        presence,
    } = context;

    const editorElement = document.createElement("div");

    /*
     * ------------------------------------------------
     * Update DOM editor to match current camera.
     * ------------------------------------------------
     */

    const updateEditorPosition = () => {
        const camera = cameraRef.current;

        const screenX =
            object.x * camera.scale +
            camera.offsetX;

        const screenY =
            object.y * camera.scale +
            camera.offsetY;

        const screenWidth =
            object.width * camera.scale;

        editorElement.style.left =
            `${screenX}px`;

        editorElement.style.top =
            `${screenY}px`;

        editorElement.style.width =
            `${screenWidth}px`;

        editorElement.style.fontSize =
            `${object.fontSize * camera.scale}px`;

        editorElement.style.borderRadius =
            object.type === "textbox"
                ? `${6 * camera.scale}px`
                : "0";

        editorElement.style.height =
            `${object.height * camera.scale}px`;

        editorElement.style.padding =
            `${12 * camera.scale}px`;

        editorElement.style.transform =
            `rotate(${object.rotation}rad)`;

        editorElement.style.transformOrigin =
            "center center";
    };

    /*
     * ------------------------------------------------
     * Register active editor.
     * ------------------------------------------------
     */

    textEditorRef.current = {
        update: updateEditorPosition,
    };

    /*
     * ------------------------------------------------
     * Basic editor configuration.
     * ------------------------------------------------
     */

    editorElement.contentEditable = "true";

    editorElement.spellcheck = false;

    editorElement.textContent = object.text;

    editorElement.style.position = "absolute";

    editorElement.style.boxSizing = "border-box";

    editorElement.style.margin = "0";

    editorElement.style.border = "none";

    editorElement.style.outline = "none";

    editorElement.style.resize = "none";

    /*
     * ------------------------------------------------
     * Background.
     * ------------------------------------------------
     */

    if (object.type === "textbox") {
        editorElement.style.background =
            object.background;
    } else {
        editorElement.style.background =
            "transparent";
    }

    /*
     * ------------------------------------------------
     * Text styling.
     * ------------------------------------------------
     */

    editorElement.style.color = object.fill;

    editorElement.style.fontFamily =
        object.fontFamily;

    editorElement.style.fontWeight =
        `${object.fontWeight}`;

    editorElement.style.lineHeight =
        `${TEXT_LINE_HEIGHT}`;

    /*
     * ------------------------------------------------
     * Textbox and CanvasText alignment.
     * ------------------------------------------------
     */

    editorElement.style.display = "flex";

    editorElement.style.alignItems = "center";

    editorElement.style.justifyContent = "center";

    editorElement.style.textAlign = "center";

    /*
     * ------------------------------------------------
     * Wrapping.
     * ------------------------------------------------
     */

    editorElement.style.whiteSpace = "pre-wrap";

    editorElement.style.overflowWrap = "anywhere";

    editorElement.style.wordBreak = "break-word";

    editorElement.style.overflow = "hidden";

    editorElement.style.zIndex = "1000";

    /*
     * ------------------------------------------------
     * Add editor to canvas parent.
     * ------------------------------------------------
     */

    const parent = canvas.parentElement;

    if (!parent) {
        textEditorRef.current = null;
        return;
    }

    parent.appendChild(editorElement);

    /*
     * Apply initial camera-dependent styles.
     */

    updateEditorPosition();

    /*
     * ------------------------------------------------
     * Hide normal object preview while editing.
     * ------------------------------------------------
     */

    presence.send({
        type: "objectPreview",
        previewType: "clear",
    });

    interactionRef.current = {
        type: "textEditing",
        objectId: object.id,
    };

    selectObject(object.id);

    requestRender();

    /*
     * ------------------------------------------------
     * Focus editor.
     * ------------------------------------------------
     */

    editorElement.focus();

    /*
     * Put cursor at the end of the text.
     */

    const selection = window.getSelection();

    if (selection) {
        const range = document.createRange();

        range.selectNodeContents(editorElement);

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(range);
    }

    const initialText = object.text;
    const initialWidth = object.width;
    const initialHeight = object.height;

    let finished = false;

    /*
     * ------------------------------------------------
     * Cleanup.
     * ------------------------------------------------
     */

    const cleanup = () => {
        if (finished) {
            return;
        }

        finished = true;

        editorElement.remove();

        textEditorRef.current = null;

        interactionRef.current = {
            type: "idle",
        };

        requestAnimationFrame(() => {
            requestRender();
        });
    };

    /*
     * ------------------------------------------------
     * Text input.
     * ------------------------------------------------
     */

    editorElement.addEventListener(
        "input",
        () => {
            const text =
                editorElement.textContent ?? "";

            editor.execute({
                type: "updateBoardObject",
                boardObjectId: object.id,
                updates: {
                    text,
                },
            });

            /*
             * The document is already updated synchronously by
             * editor.execute().
             *
             * Render again on the next frame so selection bounds
             * are calculated from the updated CanvasText.
             */
            updateEditorPosition();
            requestAnimationFrame(() => {
                requestRender();
            });
        },
    );

    /*
     * ------------------------------------------------
     * Keyboard handling.
     * ------------------------------------------------
     */

    editorElement.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                event.preventDefault();

                editor.execute({
                    type: "updateBoardObject",
                    boardObjectId: object.id,
                    updates: {
                        text: initialText,
                        width: initialWidth,
                        height: initialHeight,
                    },
                });

                cleanup();

                return;
            }

            /*
             * Prevent whiteboard keyboard shortcuts
             * from receiving text-editing keystrokes.
             */

            event.stopPropagation();
        },
    );

    /*
     * ------------------------------------------------
     * Finish editing when focus leaves the editor.
     * ------------------------------------------------
     */

    editorElement.addEventListener(
        "blur",
        () => {
            cleanup();
        },
    );
}
