import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateUserDTO } from "./dto/CreateUserDTO";
import { UserService } from "./service/UserService";
@WebSocketGateway({ cors: { 
    origin: 'http://localhost:5173',
    credentials: true,
  },
})

export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  
  constructor(private readonly UserService: UserService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log("A user has connected: " + client.id);
  }
  handleDisconnect(client: any) {
    console.log("A user has disconnected: " + client.id);
  }

  @SubscribeMessage('ping')
  handlePing(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received:', data);

    return {
      event: 'pong',
      data: {
        message: 'Hello frontend!',
      },
    };
  }

  @SubscribeMessage('CreateUser')
  async handleUserEvent(@MessageBody() data: CreateUserDTO) {
    await this.UserService.create(data);
    console.log("A user has been created through a websocket")
  }
}

