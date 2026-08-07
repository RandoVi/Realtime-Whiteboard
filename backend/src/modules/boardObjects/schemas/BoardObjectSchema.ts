import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type BoardObjectDocument = HydratedDocument<BoardObject>;

@Schema({ discriminatorKey: 'kind', timestamps: true })
export class BoardObject {

  @Prop({ required: true })
  id!: string;

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

  @Prop({ required: false, type: String })
  fill?: string;

  @Prop({ required: false, type: String })
  stroke?: string;

  @Prop({ required: false, type: Number })
  updatedAt?: number;

  @Prop({ required: false, type: Number })
  createdAt?: number;
}

export const BoardObjectSchema = SchemaFactory.createForClass(BoardObject);