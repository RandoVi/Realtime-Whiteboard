import type { Presence } from "../../network/presence/Presence";

type Args = {
  presence: Presence;
};

export function clearObjectPreview({ presence }: Args) {
  presence.send({
    type: "objectPreview",
    previewType: "clear",
  });
}