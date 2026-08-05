import type { Point } from "../../types/Types";

export interface Laser {
    id: string;
    type: "laser";
    points: Point[];
    stroke: string;
    strokeWidth: number;
    createdAt: number;
    // createdBy:string
}