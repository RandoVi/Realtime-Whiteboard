import { Module } from '@nestjs/common';
import { UserController } from './controller/UserController';
import { UserService } from './service/UserService';
import { UserRepository } from "./repository/UserRepository"
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/UserSchema';

@Module({
  imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
  controllers: [UserController],
  providers: [
        UserRepository,
        UserService,
    ],
  exports: [UserService], // in case another module needs it later
})
export class UserModule {}