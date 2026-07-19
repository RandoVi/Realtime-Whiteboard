import { Module } from '@nestjs/common';
import { WhiteboardModule } from './modules/Whiteboard/whiteboard.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [MongooseModule.forRoot(
      "mongodb://localhost:27017/realtime-whiteboard"
    ),
    UserModule, WhiteboardModule, ChatModule],
})
export class AppModule {}