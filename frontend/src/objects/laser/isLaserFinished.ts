import type { Laser } from "./Laser";


const FADE_DELAY = 2000;
const FADE_DURATION = 2000;


export function isLaserFinished(
    laser: Laser
): boolean {

    return (
        performance.now() - laser.createdAt
        >
        FADE_DELAY + FADE_DURATION
    );
}