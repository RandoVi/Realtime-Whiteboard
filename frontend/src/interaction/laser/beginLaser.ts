import type { Point } from "../../types/Types";
import { createLaser } from "../../objects/laser/createLaser";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { getCurrentUser } from "../../network/currentUser";

type Args = {
    world: Point;
    context: CanvasInteractionContext;
};

export function beginLaser({
    world,
    context,
}: Args): boolean {

    const currentUser = getCurrentUser();

    const laser = createLaser(
        world,
        currentUser.color || "#000000",
    );

    context.localLasers.push(laser);

    context.interactionRef.current = {
        type: "laser",
        laserId: laser.id,
    };

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