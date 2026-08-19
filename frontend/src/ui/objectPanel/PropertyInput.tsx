import type { ChangeEvent } from "react";
import type { ObjectProperty } from "../../objects/properties/ObjectProperty";

type Props = {
    property: ObjectProperty;
    value: unknown;
    onChange: (
        event: ChangeEvent<HTMLInputElement>
    ) => void;
};

export function PropertyInput({
    property,
    value,
    onChange,
}: Props) {
    const disabled = property.editable === false;

    switch (property.type) {
        case "number":
            return (
                <input
                    type="number"
                    min={property.min}
                    max={property.max}
                    step={property.step}
                    value={String(value)}
                    disabled={disabled}
                    onChange={onChange}
                />
            );

        case "color":
            return (
                <input
                    type="color"
                    value={String(value)}
                    disabled={disabled}
                    onChange={onChange}
                />
            );

        case "text":
            return (
                <input
                    type="text"
                    value={String(value)}
                    disabled={disabled}
                    onChange={onChange}
                />
            );
    }
}