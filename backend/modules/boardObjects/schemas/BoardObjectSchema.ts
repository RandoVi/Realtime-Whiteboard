import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type BoardObjectDocument = HydratedDocument<BoardObject>;

@Schema({ discriminatorKey: 'kind', timestamps: true })
export class BoardObject {

  @Prop({ required: true })
  _id!: string;

  @Prop({ required: false, type: String })
  color?: string;

  @Prop({ required: false, type: Number })
  x?: Number;

  @Prop({ required: false, type: Number })
  y?: Number;

  @Prop({ required: false, type: Number })
  width?: Number;

  @Prop({ required: false, type: Number })
  height?: Number;

  @Prop({ required: false, type: Number })
  radius?: Number;

  @Prop({ required: false, type: String })
  fill?: String;

  @Prop({ required: false, type: String })
  stroke?: String;

  @Prop({ required: false, type: Number })
  updatedAt?: Number;

  @Prop({ required: false, type: Number })
  createdAt?: Number;
}

export const BoardObjectSchema = SchemaFactory.createForClass(BoardObject);