import type { Object } from "../../types/Object";
import type { Editor } from "../../editor/Editor";
import { PropertyRow } from "./PropertyRow";
import { getObjectProperties } from "../../objects/getObjectProperties";

type Props = {
    object: Object;
    editor: Editor;
};

export function TransformSection({
    object,
    editor,
}: Props) {

    const properties = getObjectProperties(object);

    const transformProperties = properties.filter(
        property =>
            ["x", "y", "width", "height", "radius"]
                .includes(property.key)
    );

    if (transformProperties.length === 0) {
        return null;
    }

    return (
        <section className="inspector-section">

            <h4>Transform</h4>

            {transformProperties.map(property => (
                <PropertyRow
                    key={property.key}
                    label={property.label}
                >
                    <input
                        type="number"
                        value={String(
                            (object as Record<string, unknown>)[property.key]
                        )}
                        onChange={editor.bindProperty(
                            property.key,
                            Number
                        )}
                    />
                </PropertyRow>
            ))}

        </section>
    );
}