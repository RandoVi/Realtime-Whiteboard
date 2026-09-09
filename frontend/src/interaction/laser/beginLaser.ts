import type { Point } from "@common/types";
import { createLaser } from "../../objects/laser/createLaser";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { getCurrentUser } from "../../network/currentUser";
import { updateCursor } from "../updateCursor";

type Args = {
    world: Point;
    context: CanvasInteractionContext;
};

export function beginLaser({
    world,
    context,
}: Args): boolean {

    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        throw new Error(
            "Current user is not initialized."
        );
    }

    const laser = createLaser(world, {
        fill: "transparent",
        stroke: currentUser.color || "#000000",
        strokeWidth: 5,
    });

    context.localLasers.push(laser);

    context.interactionRef.current = {
        type: "laser",
        laserId: laser.id,
    };
    updateCursor(context);
    context.presence.send({
        type: "laser",
        laserType: "create",
        laser,
    });

    laser.points.push({
        point: world,
        createdAt: performance.now(),
    });

    context.presence.send({
        type: "laser",
        laserType: "point",
        laserId: laser.id,
        point: world,
    });

    context.requestRender();

    return true;
}