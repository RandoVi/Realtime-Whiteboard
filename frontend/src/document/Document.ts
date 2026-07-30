import type { MutableRefObject } from "react";
import type { Shape } from "../types/Shape";


export type Document = {
    shapesRef: {
        current: Shape[];
    };

    load(shapes: Shape[]): void;
};