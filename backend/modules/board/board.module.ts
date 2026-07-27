import { Module } from '@nestjs/common';
import { BoardGateway } from './board.gateway';
import { BoardService } from './service/BoardService';

@Module({
  providers: [
    BoardGateway,
    BoardService,
  ],
})
export class BoardModule {}