import type { Editor } from "../../editor/Editor";
import type { Object } from "../../types/Object";
import "./ObjectInspector.css";
import { ActionsSection } from "./ActionsSection";
import { AppearanceSection } from "./AppearanceSection";
import { TransformSection } from "./TransformSection";

type Props = {
    object?: Object;
    editor: Editor;
};

export function ObjectInspector({
    object,
    editor,
}: Props) {
    if (!object) {
        return null;
    }

    return (
        <aside className="object-inspector">

            <header className="inspector-header">

                <h3>Selected</h3>

                <span>{object.type}</span>

            </header>

            <TransformSection
                object={object}
                editor={editor}
            />

            <AppearanceSection
                object={object}
                editor={editor}
            />

            <ActionsSection
                editor={editor}
            />

        </aside>
    );
}