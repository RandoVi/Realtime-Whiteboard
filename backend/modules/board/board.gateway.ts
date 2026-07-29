import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { BoardUser } from "../../models/user";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { ChatGateway } from "../chat/chat.gateway";
import { NetworkCommand } from "../../models/networkCommand";
@WebSocketGateway({
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(
      private readonly boards: BoardService,
  ) {}

  private readonly logger = new Logger(ChatGateway.name);
  
  @WebSocketServer()
  io!: Server;

  afterInit() {
    this.logger.log("Initialized");
  }
      
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`CONNECTED - Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`DISCONNECTED - Client id:${client.id} disconnected`);
  }

    @SubscribeMessage("joinBoard")
    join(
        @ConnectedSocket() socket: Socket,
        @MessageBody() body: {
            boardId: string;
            user: BoardUser;
        },
    ) {

        const board = this.boards.getBoard(body.boardId);

        if (!board) {
            return;
        }

        board.users.add(body.user);

        socket.join(body.boardId);
    }

    @SubscribeMessage("command")
    async handleCommand(
        @MessageBody() body: NetworkCommand,
    ) {
        let board = this.boards.getBoard("1");
        console.log(body)

        if (!board) {
            board = await this.boards.createBoardAndPersist("1");
        }
        if (body.command.type === "createShape") {
            board!.objects.create(body.command.shape);
        }
        console.log("All boards: ", board!.objects.getAll())
    }

}

