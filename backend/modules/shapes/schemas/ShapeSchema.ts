import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export interface BoardObject {
  kind: string;
  color?: string;
}

export type ShapeDocument = HydratedDocument<Shape>;

@Schema({ discriminatorKey: 'kind', timestamps: true })
export class Shape implements BoardObject {
  @Prop({ required: true, type: String })
  kind!: string;

  @Prop({ required: false, type: String, default: 'black' })
  color?: string;
}

export const ShapeSchema = SchemaFactory.createForClass(Shape);