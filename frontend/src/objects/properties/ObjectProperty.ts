export type PropertySection =
    | "transform"
    | "appearance"
    | "content"
    | "text";

export type PropertyType =
    | "number"
    | "color"
    | "text";

export type ObjectProperty<T = any> = {
    key: Extract<keyof T, string>;
    label: string;

    type: PropertyType;
    section: PropertySection;

    editable?: boolean;

    min?: number;
    max?: number;
    step?: number;
};