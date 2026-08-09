import type { Point } from "../types/Object";

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