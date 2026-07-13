import { Server } from "http";

@WebSocketGateway({ cors: { origin: '*' } })
export class WhiteboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
    constructor(private readonly WhiteboardService: WhiteboardService) {}

  @SubscribeMessage('drawEvent')
  async handleDraw(@MessageBody() data: DrawEventDTO) {
    await this.WhiteboardService.saveStroke(data.boardId, data.stroke);
    this.server.to(data.boardId).emit('drawEvent', data.stroke);
  }
}

