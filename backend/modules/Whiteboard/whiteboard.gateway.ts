import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server } from "socket.io";
import { WhiteboardService } from "./service/WhiteboardService";

@WebSocketGateway({ cors: { origin: '*' } })
export class WhiteboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  
  constructor(private readonly WhiteboardService: WhiteboardService) {}

  handleConnection(client: any) {
    console.log("Whiteboard connected for: " + client.id)
  }
  handleDisconnect(client: any) {
    console.log("Whiteboard disconnected for: " + client.id)
  }

  @SubscribeMessage('WhiteboardUpdateEvent')
  async handleWhiteboardEvent(@MessageBody() data: UpdateWhiteboardDTO) {
    await this.WhiteboardService.saveEvent(data);
    this.server.to(data.boardId).emit('WhiteboardUpdateEvent', data.event);
  }
}

