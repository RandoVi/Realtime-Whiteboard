import type { Object } from "../../types/Object";
import type { Editor } from "../../editor/Editor";
import { PropertyRow } from "./PropertyRow";

type Props = {
    object: Object;
    editor: Editor;
};

export function TransformSection({
    object,
    editor,
}: Props) {
    return (
        <section className="inspector-section">

            <h4>Transform</h4>
            <PropertyRow label="X">
                <input
                    type="number"
                    value={object.x}
                    onChange={editor.bind(
                        "x",
                        Number
                    )}
                />
            </PropertyRow>

            <PropertyRow label="Y">
                <input
                    type="number"
                    value={object.y}
                    onChange={editor.bind(
                        "y",
                        Number
                    )}
                />
            </PropertyRow>

            <PropertyRow label="Width">
                <input
                    type="number"
                    value={object.width}
                    onChange={editor.bind(
                        "width",
                        Number
                    )}
                />
            </PropertyRow>

            <PropertyRow label="Height">
                <input
                    type="number"
                    value={object.height}
                    onChange={editor.bind(
                        "height",
                        Number
                    )}
                />
            </PropertyRow>

        </section>
    );
}