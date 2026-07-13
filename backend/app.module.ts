import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { WhiteboardModule } from './Whiteboard/whiteboard.module';

@Module({
  imports: [UsersModule, WhiteboardModule],
})
export class AppModule {}