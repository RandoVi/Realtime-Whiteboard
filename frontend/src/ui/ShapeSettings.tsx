import type { ChangeEvent } from "react";
import type { ObjectProperty } from "../objects/properties/ObjectProperty";
import { PropertyInput } from "./objectPanel/PropertyInput";
import { PropertyRow } from "./objectPanel/PropertyRow";

// import "./ShapeSettings.css";

type Props = {
    properties: ObjectProperty[];
    values: Record<string, unknown>;
    onChange: (key: string, value: unknown) => void;
};

export function ShapeSettings({
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
        <div className="shape-settings">
            {appearanceProperties.map(property => (
                <PropertyRow
                    key={property.key}
                    label={property.label}
                >
                    <PropertyInput
                        property={property}
                        value={values[property.key]}
                        onChange={(
                            event: ChangeEvent<HTMLInputElement>
                        ) => {
                            const value =
                                property.type === "number"
                                    ? Number(event.target.value)
                                    : event.target.value;

                            onChange(property.key, value);
                        }}
                    />
                </PropertyRow>
            ))}
        </div>
    );
}