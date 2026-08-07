
import type { CursorMovementCommand } from "./commands/CursorMovementCommand";
import type { ObjectPreviewCommand } from "./commands/ObjectPreviewCommand";
import type { SelectionCommand } from "./commands/SelectionCommand";


export type PresenceCommand =
    | CursorMovementCommand
    | ObjectPreviewCommand
    | SelectionCommand;