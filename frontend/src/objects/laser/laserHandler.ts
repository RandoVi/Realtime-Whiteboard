import type { ObjectHandler } from "../registry/ObjectHandler";
import type { Laser } from "./Laser";

import { createLaser } from "./createLaser";
import { isLaserFinished } from "./isLaserFinished";
import { renderLaser } from "./renderLaser";
import { updateLaserPreview } from "./updateLaserPreview";


export const laserHandler: ObjectHandler<Laser> = {

    create: createLaser,

    render: renderLaser,

    updatePreview: updateLaserPreview,

    isAnimated: () => true,

    isFinished: isLaserFinished,

};