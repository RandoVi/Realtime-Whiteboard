export type CanvasText = {
    id: string;
    type: "text";

    x: number;
    y: number;

    width: number;
    rotation: number;

    text: string;

    fontSize: number;
    fontFamily: string;
    fontWeight: number;

    fill: string;
}