import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server } from "socket.io";
import { WhiteboardEventDTO } from "./dto/WhiteboardEventDTO";
// import { WhiteboardService } from "./service/WhiteboardService";
@WebSocketGateway({ cors: { origin: '*' } })
export class WhiteboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  
  // constructor(private readonly WhiteboardService: WhiteboardService) {}
  handleConnection(client: any, ...args: any[]) {
    throw new Error("Method not implemented.");
  }
  handleDisconnect(client: any) {
    throw new Error("Method not implemented.");
  }

  // @SubscribeMessage('WhiteboardUpdateEvent')
  // async handleWhiteboardEvent(@MessageBody() data: WhiteboardEventDTO) {
  //   await this.WhiteboardService.saveEvent(data);
  //   this.server.to(data.boardId).emit('WhiteboardUpdateEvent', data.event);
  // }
}

