import type { Shape } from "../../types/Shape";
import type { Editor } from "../../editor/Editor";
import { PropertyRow } from "./PropertyRow";

type Props = {
    shape: Shape;
    editor: Editor;
};

export function TransformSection({
    shape,
    editor,
}: Props) {
    return (
        <section className="inspector-section">

            <h4>Transform</h4>
            <PropertyRow label="X">
                <input
                    type="number"
                    value={shape.x}
                    onChange={editor.bind(
                        "x",
                        Number
                    )}
                />
            </PropertyRow>

            <PropertyRow label="Y">
                <input
                    type="number"
                    value={shape.y}
                    onChange={editor.bind(
                        "y",
                        Number
                    )}
                />
            </PropertyRow>

            <PropertyRow label="Width">
                <input
                    type="number"
                    value={shape.width}
                    onChange={editor.bind(
                        "width",
                        Number
                    )}
                />
            </PropertyRow>

            <PropertyRow label="Height">
                <input
                    type="number"
                    value={shape.height}
                    onChange={editor.bind(
                        "height",
                        Number
                    )}
                />
            </PropertyRow>

        </section>
    );
}