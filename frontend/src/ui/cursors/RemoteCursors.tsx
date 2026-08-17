import type { Camera } from "../../camera/Camera";
import type { BoardUser } from "../../types/BoardUser";
import type { RemotePresence } from "../../network/presence/RemotePresence";
import { RemoteCursor } from "./RemoteCursor";

type Props = {
    remotePresence: Map<string, RemotePresence>;
    users: BoardUser[];
    camera: Camera;
};

export function RemoteCursors({
    remotePresence,
    users,
    camera,
}: Props) {

    return (
        <div className="remote-cursors">
            {[...remotePresence.entries()].map(
                ([userId, presence]) => {

                    if (!presence.cursor) {
                        return null;
                    }

                    const user = users.find(
                        user => user.userId === userId
                    );

                    if (!user) {
                        return null;
                    }

                    return (
                        <RemoteCursor
                            key={userId}
                            point={presence.cursor}
                            username={user.username}
                            color={user.color}
                            camera={camera}
                        />
                    );
                }
            )}
        </div>
    );
}