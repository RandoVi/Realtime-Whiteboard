import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { BoardObject } from './BoardObjectSchema';
import { BoardUser } from '../../../models/boardUser';

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, index: true })
  ownerId!: string;

  // To retain all the subproperties
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  objects!: BoardObject[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  users!: BoardUser[];


  @Prop({ default: 0 })
  version!: number;

  @Prop({ type: Date, required: true, default: Date.now, index: true })
  lastActivity!: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
//Build an index table where entries are sorted first by ownerId in ascending order, 
//then second by status in ascending order.
BoardSchema.index({ ownerId: 1, status: 1 });