
import type { CursorMovementCommand } from "../../../../common/src/commands/PresenceCommand";
import type { ObjectPreviewCommand } from "./commands/ObjectPreviewCommand";
import type { SelectionCommand } from "./commands/SelectionCommand";
import type { LaserCommand } from "./commands/LaserCommand";


export type PresenceCommand =
    | CursorMovementCommand
    | ObjectPreviewCommand
    | SelectionCommand
    | LaserCommand;