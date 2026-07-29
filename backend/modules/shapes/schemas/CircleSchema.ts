import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Circle {
  kind: string = 'Circle';

  @Prop({ required: true, type: Number })
  radius!: number;
}

export const CircleSchema = SchemaFactory.createForClass(Circle);