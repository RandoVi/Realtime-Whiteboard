import { HydratedDocument, Types } from "mongoose";
export declare class Whiteboard {
    name: string;
    email: string;
    data: Object;
}
export type WhiteboardDocument = HydratedDocument<Whiteboard>;
export declare const WhiteboardSchema: import("mongoose").Schema<Whiteboard, import("mongoose").Model<Whiteboard, any, any, any, any, any, Whiteboard>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Whiteboard, import("mongoose").Document<unknown, {}, Whiteboard, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Whiteboard & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Whiteboard, import("mongoose").Document<unknown, {}, Whiteboard, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Whiteboard & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    email?: import("mongoose").SchemaDefinitionProperty<string, Whiteboard, import("mongoose").Document<unknown, {}, Whiteboard, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Whiteboard & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    data?: import("mongoose").SchemaDefinitionProperty<Object, Whiteboard, import("mongoose").Document<unknown, {}, Whiteboard, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Whiteboard & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Whiteboard>;
//# sourceMappingURL=WhiteboardSchema.d.ts.map