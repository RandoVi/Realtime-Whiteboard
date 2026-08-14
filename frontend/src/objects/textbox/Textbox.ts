export type Textbox = {
    id: string
    type: "textbox"

    x: number
    y: number

    width: number
    height: number

    text: string

    fontSize: number
    fontFamily: string
    fontWeight: number

    fill: string
    background: string
}

const DEFAULT_TEXTBOX_TEXT_COLOR = "#1F2937"
const DEFAULT_TEXTBOX_BACKGROUND = "#FEF3C7"

const DEFAULT_TEXTBOX_FONT_FAMILY =
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const DEFAULT_TEXTBOX_FONT_SIZE = 16
const DEFAULT_TEXTBOX_FONT_WEIGHT = 500