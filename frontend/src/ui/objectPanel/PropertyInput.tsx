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
                    value={
                        typeof value === "number"
                            ? Number(value.toFixed(2))
                            : String(value)
                    }
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
                    className="property-input"
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
                    className="property-input"
                    value={String(value)}
                    disabled={disabled}
                    style={{
                        fontFamily:
                            property.key === "fontFamily"
                                ? String(value)
                                : undefined,

                        fontWeight:
                            property.key === "fontWeight"
                                ? Number(value)
                                : undefined,
                    }}
                    onChange={event => {

                        const selectedOption =
                            property.options.find(
                                option =>
                                    String(option.value) ===
                                    event.target.value
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
                            style={{
                                fontFamily:
                                    property.key === "fontFamily"
                                        ? String(option.value)
                                        : undefined,

                                fontWeight:
                                    property.key === "fontWeight"
                                        ? Number(option.value)
                                        : undefined,
                            }}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            );
    }
}