import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { BoardUser } from "../../models/user";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { NetworkCommand } from "../../models/networkCommand";
import { randomUUID } from "crypto";

  enum BoardCommand {
    Create = "CREATE",
    Join = "JOIN",
    Leave = "LEAVE",
    Get = "GET",
    Delete = "DELETE"
  }

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

  private readonly logger = new Logger(BoardGateway.name);

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

    @SubscribeMessage("boardCommand")
    async handleBoard(
        @ConnectedSocket() socket: Socket,
        @MessageBody() body: {
            id: string,
            user: BoardUser,
            type: BoardCommand
        }
    ) {
        switch (body.type) {
            case "CREATE":
                const boardId = randomUUID();
                const board = await this.boards.createBoardAndPersist(boardId, body.user.id);

                if (!board) {
                    return;
                }

                board.users.add(body.user);

                socket.join(board.id);
            case "JOIN":
                if (this.boards.hasBoard(body.id)) {
                    const board = this.boards.getBoard(body.id);

                    if (!board) return

                    board?.users.add(body.user);
                    socket.join(board!.id);
                    this.io.to(board!.id).emit("user-joined-board", {
                        userId: body.user.id,
                        username: body.user.username
                    })
                }
            case "LEAVE":
            case "GET":
            case "DELETE":
        }
    }

    @SubscribeMessage("command")
    async handleCommand(
        @MessageBody() body: NetworkCommand,
    ) {
        let board = this.boards.getBoard(body.clientId);
        console.log(body)

        if (!board) {
            const id = randomUUID();
            board = await this.boards.createBoardAndPersist(id, body.clientId);
        }
        if (body.command.type === "createShape") {
            board!.objects.create(body.command.shape);
        }
        console.log("All objects in board: ", board!.objects.getAll())
        console.log("All boards: ", this.boards.getBoards())
    }

}

