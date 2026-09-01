import type { ObjectProperty } from "../objects/properties/ObjectProperty";
import { PropertyInput } from "./objectPanel/PropertyInput";
import { PropertyRow } from "./objectPanel/PropertyRow";

type Props = {
    properties: ObjectProperty[];
    values: Record<string, unknown>;
    onChange: (key: string, value: unknown) => void;
};

export function ObjectSettings({
    properties,
    values,
    onChange,
}: Props) {
    const appearanceProperties = properties.filter(
        property => property.section === "appearance"
    );

    if (appearanceProperties.length === 0) {
        return null;
    }

    return (
        <div className="object-settings">
            {appearanceProperties.map(property => (
                <PropertyRow
                    key={property.key}
                    label={property.label}
                >
                    <PropertyInput
                        property={property}
                        value={values[property.key]}
                        onChange={(value) => {
                            onChange(property.key, value);
                        }}
                    />
                </PropertyRow>
            ))}
        </div>
    );
}