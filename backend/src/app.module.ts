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
        /*
        This needs certificates and setup for docker as well
        tls: true,
        */
      }),
    }),
    
    BoardModule
  ],
})
export class AppModule {}