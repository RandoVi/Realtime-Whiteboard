import type { ObjectProperty } from "../objects/properties/ObjectProperty";
import { PropertyInput } from "./objectPanel/PropertyInput";
import { PropertyRow } from "./objectPanel/PropertyRow";

type PenSettingsProps = {
    properties: ObjectProperty[];
    values: Record<string, unknown>;
    onChange: (key: string, value: unknown) => void;
};

export function PenSettings({
    properties,
    values,
    onChange,
}: PenSettingsProps) {
    return (
        <div className="object-settings">
            {properties.map(property => (
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