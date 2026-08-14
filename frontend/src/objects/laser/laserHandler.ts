import type { ObjectHandler } from "../registry/ObjectHandler";
import type { Laser } from "@common/shapes"

import { createLaser } from "./createLaser";

import { renderLaser } from "./renderLaser";
import { updateLaserPreview } from "./updateLaserPreview";


export const laserHandler: ObjectHandler<Laser> = {

    create: createLaser,

    render: renderLaser,

    updatePreview: updateLaserPreview,

    // isAnimated: () => true,

};