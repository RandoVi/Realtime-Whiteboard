import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Shape } from '../../shapes/schemas/ShapeSchema';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true, index: true })
  ownerId!: string;

  @Prop({
    type: String,
    enum: ['active', 'archived', 'read-only'],
    default: 'active',
    index: true,
  })
  status!: string;
  // To retain all the subproperties
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  shapes!: Shape[];

  @Prop({ default: 0 })
  version!: number;

  applyUpdate(changes: Partial<BoardDocument>): void {
    if (changes.shapes) {
      this.shapes = changes.shapes;
    }
  }
}

export const BoardSchema = SchemaFactory.createForClass(Board);
//Build an index table where entries are sorted first by ownerId in ascending order, 
//then second by status in ascending order.
BoardSchema.index({ ownerId: 1, status: 1 });