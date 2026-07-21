import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Whiteboard {

    @Prop({ required: true })
    name!: string;

    @Prop({
        required: true,
        unique: true,
    })
    email!: string;

    @Prop({
        required:true
    })
    data: Object = [];
}
export type WhiteboardDocument = HydratedDocument<Whiteboard>;

export const WhiteboardSchema = SchemaFactory.createForClass(Whiteboard);