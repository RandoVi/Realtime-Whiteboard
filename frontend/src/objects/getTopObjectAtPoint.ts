import type { BoardObject, Point } from "@common/types"
import { hitTestObject } from "./hitTestObject";


export function getTopObjectAtPoint(
    objects: BoardObject[],
    point: Point,
){
    return objects.slice().reverse().find(object=> hitTestObject(point, object))
}