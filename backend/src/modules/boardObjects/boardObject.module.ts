import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardObject, BoardObjectSchema } from './schemas/BoardObjectSchema';

import { BoardObjectsService } from './service/BoardObjectService';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BoardObject.name,
        schema: BoardObjectSchema,
      },
    ]),
  ],
  providers: [BoardObjectsService],
  exports: [BoardObjectsService],
})
export class BoardObjectsModule {}