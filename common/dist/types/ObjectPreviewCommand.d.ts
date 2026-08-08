import type { Object } from "./Object";
export type ObjectPreviewCommand = {
    type: "objectPreview";
    previewType: "create";
    boardObject: Object;
} | {
    type: "objectPreview";
    previewType: "update";
    boardObjectId: string;
    updates: Partial<Object>;
} | {
    type: "objectPreview";
    previewType: "clear";
};
//# sourceMappingURL=ObjectPreviewCommand.d.ts.map