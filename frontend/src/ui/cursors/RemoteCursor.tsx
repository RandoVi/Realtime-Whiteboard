import type { Camera } from "../../types/Types";
import { worldToScreen } from "../../camera/Camera";
import "./RemoteCursor.css";
import { CursorIcon } from "../icons/CursorIcon";
import type { Point } from "@common/types";

type Props = {
    point: Point;
    username: string;
    color: string;
    camera: Camera;
};

export function RemoteCursor({
    point,
    username,
    color,
    camera,
}: Props) {

    const screen = worldToScreen(point, camera);

    return (
        <div
            className="remote-cursor"
            style={{
                transform: `translate(${screen.x}px, ${screen.y}px)`,
                "--cursor-color": color,
            } as React.CSSProperties}
        >
            <CursorIcon color={color} />

            <span className="remote-cursor__label">
                {username}
            </span>
        </div>
    );
}