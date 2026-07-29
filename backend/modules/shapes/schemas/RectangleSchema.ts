import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Rectangle {
  kind: string = 'Rectangle';

  @Prop({ required: true, type: Number })
  width!: number;

  @Prop({ required: true, type: Number })
  height!: number;
}

export const RectangleSchema = SchemaFactory.createForClass(Rectangle);