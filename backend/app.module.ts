import { Module } from '@nestjs/common';
import { WhiteboardModule } from './modules/Whiteboard/whiteboard.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';

dotenv.config();

const url = process.env.DATABASE_URL!;

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // This prevents mongoose from crashing due to undefined url and breaks it immediately.
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('DATABASE_URL'),
      }),
    }),

    // Example injection of env variables using config service managed by nestJS, which allows for safer and more reusable injections.
  
//   @Injectable()
//   export class AuthService {
//   constructor(private readonly config: ConfigService) {}

//   getSecret() {
//     return this.config.getOrThrow<string>('JWT_SECRET');
//     }
//   }
    
    UserModule, WhiteboardModule, ChatModule,
  ],
})
export class AppModule {}