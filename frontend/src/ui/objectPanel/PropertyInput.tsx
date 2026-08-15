import type { Object } from "@common/types";
import type { Editor } from "../../editor/Editor";
import type { ObjectProperty } from "../../objects/properties/ObjectProperty";

type Props = {
    object: Object;
    property: ObjectProperty;
    editor: Editor;
};

export function PropertyInput({
    object,
    property,
    editor,
}: Props) {
    const value = String(
        (object as Record<string, unknown>)[property.key]
    );
    const disabled = property.editable === false;
    
    switch (property.type) {
        case "number":
            return (
                <input
                    type="number"
                    min={property.min}
                    max={property.max}
                    step={property.step}
                    value={value}
                    disabled={disabled}
                    onChange={editor.bindProperty(
                        property.key,
                        Number
                    )}
                />
            );

        case "color":
            return (
                <input
                    type="color"
                    value={value}
                    disabled={disabled}
                    onChange={editor.bindProperty(property.key)}
                />
            );

        case "text":
            return (
                <input
                    type="text"
                    value={value}
                    disabled={disabled}
                    onChange={editor.bindProperty(property.key)}
                />
            );
    }
}