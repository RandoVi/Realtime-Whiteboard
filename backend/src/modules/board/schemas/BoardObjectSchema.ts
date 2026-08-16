import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Point } from "@whiteboard/common";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";


export type BoardObjectDocument = HydratedDocument<BoardObject>;

@Schema({ timestamps: true })
export class BoardObject {

  @Prop({ required: true })
  id!: string;

  @Prop({required: true,type: String,})
  type!: string;

  @Prop({ required: false, type: String })
  color?: string;

  @Prop({ required: false, type: Number })
  x?: number;

  @Prop({ required: false, type: Number })
  y?: number;

  @Prop({ required: false, type: Number })
  width?: number;

  @Prop({ required: false, type: Number })
  height?: number;

  @Prop({ required: false, type: Number })
  radius?: number;

  @Prop({ required: false, type: Number })
  rotation?: number;

  @Prop({ required: false, type: String })
  fill?: string;

  @Prop({ required: false, type: String })
  stroke?: string;

  @Prop({ required: false, type: Number })
  strokeWidth?: number;


  @Prop({required: false, type: [MongooseSchema.Types.Mixed],})
  points?: Point[];

  @Prop({ required: false, type: String })
  text?: string;

  @Prop({ required: false, type: Number })
  fontSize?: number;

  @Prop({ required: false, type: String })
  fontFamily?: string;

  @Prop({ required: false, type: Number })
  fontWeight?: number;

  @Prop({ required: false, type: String })
  background?: string;

  @Prop({ required: false, type: Number })
  updatedAt?: number;

  @Prop({ required: false, type: Number })
  createdAt?: number;

    constructor(data: Partial<BoardObject> & { id: string }) {
          Object.assign(this, data);
    }
  }



export const BoardObjectSchema = SchemaFactory.createForClass(BoardObject);