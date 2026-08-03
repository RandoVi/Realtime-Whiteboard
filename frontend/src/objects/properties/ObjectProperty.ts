export type ObjectProperty<T = any> = {
    key: Extract<keyof T, string>
    label: string
    type: "color" | "text" | "number"

    editable?: boolean
}