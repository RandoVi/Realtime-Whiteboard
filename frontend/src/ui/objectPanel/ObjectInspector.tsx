import type { Editor } from "../../editor/Editor";
import type { Shape } from "../../types/Shape";
import { PropertyRow } from "./PropertyRow";
import "./ObjectInspector.css";
import { ActionsSection } from "./ActionsSection";
import { AppearanceSection } from "./AppearanceSection";
import { TransformSection } from "./TransformSection";

type Props = {
    shape?: Shape;
    editor: Editor;
};

export function ObjectInspector({
    shape,
    editor,
}: Props) {
    if (!shape) {
        return null;
    }

    return (
        <aside className="object-inspector">

            <header className="inspector-header">

                <h3>Selected</h3>

                <span>{shape.type}</span>

            </header>

            <TransformSection
                shape={shape}
                editor={editor}
            />

            <AppearanceSection
                shape={shape}
                editor={editor}
            />

            <ActionsSection
                editor={editor}
            />

        </aside>
    );
}