import type { MutableRefObject } from "react";
import type { Object } from "../types/Object";


export type Document = {
    objectsRef: {
        current: Object[];
    };

    load(objects: Object[]): void;
};