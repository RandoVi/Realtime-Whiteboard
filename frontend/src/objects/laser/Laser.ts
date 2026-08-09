import type { Point } from "../../types/Types";

export type LaserPoint = {
    point: Point;
    createdAt: number;
};

export interface Laser {
    id: string;
    type: "laser";
    points: LaserPoint[];
    stroke: string;
    strokeWidth: number;
}