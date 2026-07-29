import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BoardCommandDTO } from "./dto/BoardCommandDTO";
import { BoardCommand } from "../../common/enum/BoardCommand";
import { ShapeCommandDTO } from "../../models/shapeCommandDTO";
import { BoardUser } from "../../models/user";

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
        @MessageBody() data: BoardCommandDTO
    ) {
        switch (data.type) {
            case BoardCommand.CREATE:

                const boardId = randomUUID();
                const hostId = randomUUID();
                const board = await this.boards.createBoardAndPersist(boardId, hostId);
                
                if (!board) {
                    return;
                }

                const hostUser = new BoardUser();
                hostUser.id = hostId;
                hostUser.username = "HOST";

                board.users.add(hostUser);

                socket.join(board.id);
                socket.emit("created", {
                    hostId: board.ownerId,
                    boardId: board.id,
                });

            case BoardCommand.JOIN:
                if (!data.id) {
                    console.log("No id in socket under JOIN command")
                    return
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) return
                    if (!data.user) return

                    board.users.add(data.user);
                    socket.join(board.id);
                    this.io.to(board.id).emit("user-joined-board", {
                        userId: data.user.id,
                        username: data.user.username
                    })
                }

            case BoardCommand.LEAVE:

            case BoardCommand.GET:

            case BoardCommand.DELETE:
            
            default:
                console.log("BOARD: default, no commands")
        }
    }

    @SubscribeMessage("command")
    async handleCommand(
        @MessageBody() body: ShapeCommandDTO,
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

