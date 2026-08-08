import type { Object } from "./Object";

export type ObjectPreviewCommand =
  | {
    type: "objectPreview";
    previewType: "create"; //indicates that the object is being created
    boardObject: Object; //bcs object doesn't exist yet, we send the whole object
  }
  | {
    type: "objectPreview";
    previewType: "update"; //indicates update of an existing object
    boardObjectId: string;
    updates: Partial<Object>; //bcs object already exists, we send only the updates(partial)
    
  }
  | {
    type: "objectPreview";
    previewType: "clear";
  };