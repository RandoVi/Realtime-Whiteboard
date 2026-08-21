
import type { ObjectProperty } from "../../objects/properties/ObjectProperty";

type Props = {
    property: ObjectProperty;
    value: unknown;
    onChange: (value: unknown) => void;
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
                    className="property-input"
                    type="number"
                    min={property.min}
                    max={property.max}
                    step={property.step}
                    value={String(value)}
                    disabled={disabled}
                    onChange={event =>
                        onChange(Number(event.target.value))
                    }
                />
            );

        case "color":
            return (
                <input
                    className="property-input property-color-input"
                    type="color"
                    value={String(value)}
                    disabled={disabled}
                    onChange={event =>
                        onChange(event.target.value)
                    }
                />
            );

        case "text":
            return (
                <input
                    type="text"
                    value={String(value)}
                    disabled={disabled}
                    onChange={event =>
                        onChange(event.target.value)
                    }
                />
            );

        case "select":
            return (
                <select
                    value={String(value)}
                    disabled={disabled}
                    onChange={event => {
                        const selectedOption = property.options.find(
                            option =>
                                String(option.value) === event.target.value
                        );

                        if (!selectedOption) {
                            return;
                        }

                        onChange(selectedOption.value);
                    }}
                >
                    {property.options.map(option => (
                        <option
                            key={String(option.value)}
                            value={String(option.value)}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            );
    }
}