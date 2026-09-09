import type { BoardObject } from "@common/types";
import type { Editor } from "../../editor/Editor";
import type {
    PropertySection as PropertySectionType,
} from "../../objects/properties/ObjectProperty";

import { getObjectProperties } from "../../objects/getObjectProperties";
import { PropertyInput } from "./PropertyInput";
import { PropertyRow } from "./PropertyRow";

type Props = {
    title: string;
    section: PropertySectionType;
    object: BoardObject;
    editor: Editor;
};

export function PropertySection({
    title,
    section,
    object,
    editor,
}: Props) {
    const properties = getObjectProperties(object)
        .filter(property => property.section === section);

    if (properties.length === 0) {
        return null;
    }

    return (
        <section className="inspector-section">
            <h4>{title}</h4>

            {properties.map(property => (
                <PropertyRow
                    key={property.key}
                    label={property.label}
                >
                    <PropertyInput
                        property={property}
                        value={(object as Record<string, unknown>)[property.key]}
                        onChange={editor.bindProperty(property.key)}
                    />
                </PropertyRow>
            ))}
        </section>
    );
}