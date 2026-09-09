export type PropertySection =
    | "transform"
    | "appearance"
    | "content"
    | "text";

type BaseProperty<T> = {
    key: Extract<keyof T, string>;
    label: string;
    section: PropertySection;
    editable?: boolean;
};

type NumberProperty<T> = BaseProperty<T> & {
    type: "number";
    min?: number;
    max?: number;
    step?: number;
};

type ColorProperty<T> = BaseProperty<T> & {
    type: "color";
};

type TextProperty<T> = BaseProperty<T> & {
    type: "text";
};

type SelectProperty<T> = BaseProperty<T> & {
    type: "select";
    options: {
        value: string | number;
        label: string;
    }[];
};

export type ObjectProperty<T = any> =
    | NumberProperty<T>
    | ColorProperty<T>
    | TextProperty<T>
    | SelectProperty<T>;