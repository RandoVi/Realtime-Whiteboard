import type { Textbox } from "../../objects/textbox/Textbox";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
    textbox: Textbox;
    context: CanvasInteractionContext;
};

export function startTextboxEditing({
    textbox,
    context,
}: Args) {

    const {
        canvas,
        cameraRef,
        interactionRef,
        editor,
        requestRender,
        selectObject,
        presence,
    } = context;

    const camera = cameraRef.current;

    const editorElement = document.createElement("div");

    const screenX =
        textbox.x * camera.scale + camera.offsetX;

    const screenY =
        textbox.y * camera.scale + camera.offsetY;

    const screenWidth =
        textbox.width * camera.scale;

    const screenHeight =
        textbox.height * camera.scale;

    const padding = 12 * camera.scale;

    editorElement.contentEditable = "true";
    editorElement.spellcheck = false;

    editorElement.textContent = textbox.text;

    editorElement.style.position = "absolute";

    editorElement.style.left = `${screenX}px`;
    editorElement.style.top = `${screenY}px`;

    editorElement.style.width = `${screenWidth}px`;
    editorElement.style.height = `${screenHeight}px`;

    editorElement.style.boxSizing = "border-box";

    editorElement.style.margin = "0";
    editorElement.style.padding = `${padding}px`;

    editorElement.style.border = "none";
    editorElement.style.outline = "none";

    editorElement.style.resize = "none";

    editorElement.style.background = textbox.background;

    editorElement.style.color = textbox.fill;

    editorElement.style.fontFamily = textbox.fontFamily;

    editorElement.style.fontSize =
        `${textbox.fontSize * camera.scale}px`;

    editorElement.style.fontWeight =
        `${textbox.fontWeight}`;

    editorElement.style.lineHeight = "1.2";

    editorElement.style.textAlign = "center";



    editorElement.style.display = "flex";
    editorElement.style.alignItems = "center";
    editorElement.style.justifyContent = "center";

    editorElement.style.overflow = "hidden";

    editorElement.style.whiteSpace = "pre-wrap";
    editorElement.style.overflowWrap = "anywhere";
    editorElement.style.wordBreak = "break-word";

    editorElement.style.zIndex = "1000";

    editorElement.style.borderRadius =
        `${6 * camera.scale}px`;

    const parent = canvas.parentElement;

    if (!parent) {
        return;
    }

    parent.appendChild(editorElement);

    presence.send({
        type: "objectPreview",
        previewType: "clear",
    });

    interactionRef.current = {
        type: "textEditing",
        objectId: textbox.id,
    };

    selectObject(textbox.id);

    requestRender();

    editorElement.focus();

    // Put the cursor at the end of the text.
    const selection = window.getSelection();

    if (selection) {

        const range = document.createRange();

        range.selectNodeContents(editorElement);

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(range);
    }

    let finished = false;

    const cleanup = () => {

        if (finished) {
            return;
        }

        finished = true;

        editorElement.remove();

        interactionRef.current = {
            type: "idle",
        };

        requestAnimationFrame(() => {
            requestRender();
        });
    };

    editorElement.addEventListener("input", () => {

        editor.execute({
            type: "updateBoardObject",
            boardObjectId: textbox.id,
            updates: {
                text: editorElement.textContent ?? "",
            },
        });

    });

    editorElement.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            event.preventDefault();

            editor.execute({
                type: "updateBoardObject",
                boardObjectId: textbox.id,
                updates: {
                    text: textbox.text,
                },
            });

            cleanup();

            return;
        }

        // Prevent whiteboard keyboard shortcuts from
        // receiving text-editing keystrokes.
        event.stopPropagation();
    });

    editorElement.addEventListener("blur", () => {
        cleanup();
    });
}