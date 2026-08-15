import type { Object, Point } from "@common/types"
import { hitTestObject } from "./hitTestObject";


export function getTopObjectAtPoint(
    objects: Object[],
    point: Point,
){
    return objects.slice().reverse().find(object=> hitTestObject(point, object))
}