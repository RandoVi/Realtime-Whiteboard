
import { boardId } from "../../network/board";
import type { Presence } from "./Presence";
import type { PresenceCommand } from "./PresenceCommand";
import { socket } from "../SocketClient";
import { getCurrentUser } from "../../network/currentUser";
import type { Point } from "../../types/Types";


export class SocketPresence implements Presence {

    private cursorFramePending = false;
    private latestCursorPoint?: Point;

    private commandHandler?:
        (userId: string, command: PresenceCommand) => void


    constructor() {

        socket.on(
            "boardPresenceCommand",
            message => {
                this.commandHandler?.(
                    message.userId,
                    message.command,

                );
                // console.log("Received presence command:", message);
            }
        );
    }


    send(command: PresenceCommand): void {

        const currentUser = getCurrentUser();

        if (!currentUser) {
            return
        }

        const message = {
            id: crypto.randomUUID(),
            userId: currentUser.userId,
            boardId,
            command,
        };
        // console.log("Sending presence command:", message);

        socket.emit(
            "boardPresenceCommand",
            message
        );
    }
    // cursor is sent in a throttled manner to avoid sending too many messages per second. 
    // The latest cursor position is sent on the next animation frame.
    sendCursor(point: Point): void {

        this.latestCursorPoint = point;

        if (this.cursorFramePending) {
            return;
        }

        this.cursorFramePending = true;

        requestAnimationFrame(() => {

            this.cursorFramePending = false;

            if (!this.latestCursorPoint) {
                return;
            }

            this.send({
                type: "cursorMovement",
                point: this.latestCursorPoint,
            });
        });
    }

    onCommand(
        handler: (
            userId: string,
            command: PresenceCommand,
        ) => void
    ): void {

        this.commandHandler = handler;

    }
}