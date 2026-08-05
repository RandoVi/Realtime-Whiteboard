import type { Camera } from "../../types/Types";
import type { Laser } from "./Laser";


const FADE_DELAY = 2000;
const FADE_DURATION = 2000;


export function renderLaser(
    context: CanvasRenderingContext2D,
    laser: Laser,
    camera: Camera,
) {

    const elapsed = performance.now() - laser.createdAt;


    let startIndex = 0;


    if (elapsed > FADE_DELAY) {

        const fadeProgress =
            Math.min(
                (elapsed - FADE_DELAY) / FADE_DURATION,
                1
            );


        startIndex = Math.floor(
            fadeProgress * laser.points.length
        );
    }


    const visiblePoints =
        laser.points.slice(startIndex);


    if (visiblePoints.length < 2) {
        return;
    }


    context.beginPath();

    context.strokeStyle = laser.stroke;
    context.lineWidth = laser.strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";


    const first = visiblePoints[0];


    context.moveTo(
        first.x * camera.scale + camera.offsetX,
        first.y * camera.scale + camera.offsetY
    );


    for (let i = 1; i < visiblePoints.length; i++) {

        const point = visiblePoints[i];

        context.lineTo(
            point.x * camera.scale + camera.offsetX,
            point.y * camera.scale + camera.offsetY
        );
    }


    context.stroke();
}