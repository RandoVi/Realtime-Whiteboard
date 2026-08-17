import type { Camera } from "../camera/Camera";
import type { BoardUser } from "../types/BoardUser";
import type { RemotePresence } from "../network/presence/RemotePresence";
import { worldToScreen } from "../camera/Camera";

type Args = {
    ctx: CanvasRenderingContext2D;
    camera: Camera;
    remotePresence: Map<string, RemotePresence>;
    users: BoardUser[];
};

export function renderRemoteCursors({
    ctx,
    camera,
    remotePresence,
    users,
}: Args) {

    for (const [userId, presence] of remotePresence) {

        if (!presence.cursor) {
            continue;
        }

        const user = users.find(
            user => user.userId === userId
        );

        if (!user) {
            continue;
        }

        const point = worldToScreen(
            presence.cursor,
            camera
        );

        renderCursor(
            ctx,
            point.x,
            point.y,
            user.color,
            user.username,
        );
    }
}

function renderCursor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    username: string,
) {

    ctx.save();

    /*
     * Cursor arrow
     */
    ctx.beginPath();

    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y + 18);
    ctx.lineTo(x + 9, y + 13);
    ctx.lineTo(x + 15, y + 21);

    ctx.lineTo(x + 19, y + 18);
    ctx.lineTo(x + 13, y + 10);
    ctx.lineTo(x + 20, y + 8);

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /*
     * Username
     */
    ctx.font = "12px sans-serif";

    const paddingX = 6;
    // const paddingY = 4;

    const textWidth = ctx.measureText(username).width;

    const labelX = x + 14;
    const labelY = y + 22;

    const labelWidth = textWidth + paddingX * 2;
    const labelHeight = 20;

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.roundRect(
        labelX,
        labelY,
        labelWidth,
        labelHeight,
        4,
    );
    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.textBaseline = "middle";
    ctx.fillText(
        username,
        labelX + paddingX,
        labelY + labelHeight / 2,
    );

    ctx.restore();
}