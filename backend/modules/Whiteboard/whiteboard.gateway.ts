import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { WhiteboardService } from "./service/WhiteboardService";
import { Shape } from "../../models/shape";
import { BoardUser } from "../../models/user";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { ChatGateway } from "../chat/chat.gateway";
@WebSocketGateway()
export class WhiteboardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(
      private readonly boards: WhiteboardService,
  ) {}

  private readonly logger = new Logger(ChatGateway.name);
  
  @WebSocketServer()
  io!: Server;

  afterInit() {
    this.logger.log("Initialized");
  }
      
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id:${client.id} disconnected`);
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

    @SubscribeMessage("createShape")
    createShape(
        @MessageBody() body: {
            boardId: string;
            shape: Shape;
        },
    ) {

        const board = this.boards.getBoard(body.boardId);

        if (!board) {
            return;
        }

        board.objects.create(body.shape);
    }

}

