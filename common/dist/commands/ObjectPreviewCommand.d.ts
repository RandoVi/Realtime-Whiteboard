import type { BoardObject } from "../types/Object";
export type ObjectPreviewCommand = {
    type: "objectPreview";
    previewType: "create";
    boardObject: BoardObject;
} | {
    type: "objectPreview";
    previewType: "update";
    boardObjectId: string;
    updates: Partial<BoardObject>;
} | {
    type: "objectPreview";
    previewType: "clear";
};
//# sourceMappingURL=ObjectPreviewCommand.d.ts.map