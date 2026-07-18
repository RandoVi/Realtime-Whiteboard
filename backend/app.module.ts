import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { WhiteboardModule } from './modules/Whiteboard/whiteboard.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(
      "mongodb://localhost:27017/whiteboard-app"
    ),
    UserModule, WhiteboardModule, ChatModule],
  providers: [ChatGateway],
})
export class AppModule {}