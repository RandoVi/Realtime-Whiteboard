import { Module } from '@nestjs/common';
import { UserController } from './controller/UserController';
import { UserService } from './service/UserService';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // in case another module needs it later
})
export class UsersModule {}