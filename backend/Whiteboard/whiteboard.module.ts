import { Module } from '@nestjs/common';

@Module({
  providers: [WhiteboardGateway],
})
export class WhiteboardModule {}