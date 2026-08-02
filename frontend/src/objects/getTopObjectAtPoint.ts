import type { Point } from "../types/Types";
import { hitTestObject } from "./hitTestObject";
import type { Object } from "../types/Object";

export function getTopObjectAtPoint(
    objects: Object[],
    point: Point,
){
    return objects.slice().reverse().find(object=> hitTestObject(point, object))
}