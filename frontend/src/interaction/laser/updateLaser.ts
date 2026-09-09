import type { Point } from "@common/types";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
    world: Point;
    context: CanvasInteractionContext;
};

export function updateLaser({
    world,
    context,
}: Args): boolean {

    const interaction = context.interactionRef.current;

    if (interaction.type !== "laser") {
        return false;
    }

    const laser = context.localLasers.find(
        laser => laser.id === interaction.laserId
    );

    if (!laser) {
        return false;
    }

    laser.points.push({
        point: world,
        createdAt: performance.now(),
    });

    // console.log("SENDING LASER POINT", {
    //     laserId: laser.id,
    //     point: world,
    // });

    context.presence.send({
        type: "laser",
        laserType: "point",
        laserId: laser.id,
        point: world,
    });

    context.requestRender();

    return true;
}