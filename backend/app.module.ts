import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { WhiteboardModule } from './modules/Whiteboard/whiteboard.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [UsersModule, WhiteboardModule, ChatModule],
  providers: [ChatGateway],
})
export class AppModule {}