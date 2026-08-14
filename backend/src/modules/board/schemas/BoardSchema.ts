import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { BoardObject } from '../../boardObjects/schemas/BoardObjectSchema';
import { BoardUser } from '../../../models/boardUser';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, index: true })
  ownerId!: string;

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
    index: true,
  })
  status!: string;
  // To retain all the subproperties
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  objects!: BoardObject[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  users!: BoardUser[];


  @Prop({ default: 0 })
  version!: number;

  applyUpdate(changes: Partial<BoardDocument>): void {
    if (changes.objects) {
      this.objects = changes.objects;
    }
    if (changes.users) {
      this.users = changes.users;
    }
  }
}

export const BoardSchema = SchemaFactory.createForClass(Board);
//Build an index table where entries are sorted first by ownerId in ascending order, 
//then second by status in ascending order.
BoardSchema.index({ ownerId: 1, status: 1 });