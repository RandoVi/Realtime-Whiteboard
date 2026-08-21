import type { ObjectStyle } from "../objects/ObjectStyle";
import type { ObjectProperty } from "../objects/properties/ObjectProperty";



export const penProperties: ObjectProperty<ObjectStyle>[] = [
    {
        key: "stroke",
        label: "Color",
        type: "color",
        section: "appearance",
        editable: true,
    },
    {
        key: "strokeWidth",
        label: "Width",
        type: "number",
        section: "appearance",
        min: 1,
        max: 20,
        step: 1,
        editable: true,
    },
];