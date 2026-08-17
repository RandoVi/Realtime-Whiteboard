import { Module } from '@nestjs/common';
import { BoardGateway } from './board.gateway';
import { BoardService } from './service/BoardService';
import { BoardRepository } from './repository/BoardRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './schemas/BoardSchema';
import { RateLimiterService } from '../../common/rate-limit/rate-limit.service';
import { WsConnectionLimitService } from '../../common/rate-limit/ws-connection-limit-service';
import { WsRateLimitGuard } from '../../common/rate-limit/ws-rate-limit.guard';

@Module({
  imports: [
    // 👇 THIS is required for @InjectModel to work
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]) 
  ],
  providers: [
    BoardGateway,
    BoardService,
    BoardRepository,
    RateLimiterService,
    WsRateLimitGuard,
    WsConnectionLimitService,
  ],
})
export class BoardModule {}