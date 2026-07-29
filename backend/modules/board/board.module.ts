import { Module } from '@nestjs/common';
import { BoardGateway } from './board.gateway';
import { BoardService } from './service/BoardService';
import { BoardRepository } from './repository/BoardRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './schemas/BoardSchema';

@Module({
  imports: [
    // 👇 THIS is required for @InjectModel to work
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]) 
  ],
  providers: [
    BoardGateway,
    BoardService,
    BoardRepository,
  ],
})
export class BoardModule {}