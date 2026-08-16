import { Module } from '@nestjs/common';
import { BoardModule } from './modules/board/board.module';
import { MongooseModule } from '@nestjs/mongoose';
import dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';

dotenv.config();

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
    
    BoardModule
  ],
})
export class AppModule {}