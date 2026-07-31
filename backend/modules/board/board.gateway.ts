import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BoardCommandDTO } from "./dto/BoardCommandDTO";
import { BoardCommand } from "../../common/enum/BoardCommand";
import { BoardObjectCommandDTO } from "../../models/boardObjectCommandDTO";
import { BoardUser } from "../../models/user";
import { io } from "socket.io-client";
import { BoardStateDTO } from "./dto/BoardStateDTO";

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
                    console.log('No "board" in socket(CREATE - BOARD)')
                    break;
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
                console.log("Board created with id: " + board.id)
                break;
            case BoardCommand.JOIN:
                if (!data.id) {
                    console.log('No "id" in socket(JOIN - BOARD)')
                    socket.emit("join-board-response", "No boardId sent with socket(missing)")
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.log('No "board" in socket(JOIN - BOARD)')
                        socket.emit("join-board-response", "No board with id: " + data.id + " exists.")
                        break
                    }
                        
                    if (!data.user) {
                        console.log('No "user" in socket(JOIN - BOARD)')
                        socket.emit("join-board-response", "No user data available (missing)")
                        break
                    }
                    board.users.add(data.user);
                    socket.join(board.id);

                    const dto = new BoardStateDTO(board.id, board.ownerId, board.objects.getAll(), board.users.getAll());

                    socket.emit("board-state", dto);
                    socket.broadcast.to(board.id).emit("user-joined-board", {
                        userId: data.user.id,
                        username: data.user.username
                    })
                    console.log("User " + data.user.username + " joined  the board: " + data.id)
                }
                break;
            case BoardCommand.LEAVE:
                if (!data.id) {
                    console.log('No "id" in socket(LEAVE - BOARD)')
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.log('No "board" in socket(JOIN)')
                        break
                    }
                        
                    if (!data.user) {
                        console.log('No "user" in socket(JOIN)')
                        break
                    }
                    board.users.remove(data.user.id);
                    socket.leave(board.id);
                    socket.broadcast.to(board.id).emit("user-left-board", {
                        userId: data.user.id,
                        username: data.user.username
                    })
                    console.log("User " + data.user.username + " left  the board: " + data.id)
                }
                break;
            case BoardCommand.GET: {
                if (!data.id) {
                    console.log('No "id" in socket(GET - BOARD)')
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.log('No "board" in socket(GET - BOARD)')
                        break
                    }
                    socket.emit("get-board-response", {
                        boardId: board.id,
                        hostId: board.ownerId,
                    })
                    console.log("Emitted 'get-board-response' with board data")
                    }
                break;
                }
            case BoardCommand.DELETE:
                if (!data.id) {
                    console.log('No "id" in socket(DELETE - BOARD)')
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.log('No "board" in socket(DELETE - BOARD)')
                        break
                    }
                        
                    if (!data.user) {
                        console.log('No "user" in socket(DELETE - BOARD)')
                        break
                    }
                    this.boards.deleteBoard(data.id)

                    this.io.in(board.id).socketsLeave(board.id);
                    console.log("Board deleted, user sockets removed")
                }
                break;
            default:
                console.log("BOARD: default response, no commands")
                break;
        }
    }

    @SubscribeMessage("boardObjectCommand")
    async handleObjectCommand(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardObjectCommandDTO,
    ) {
        switch (data.command.type){
            case "createBoardObject": {
                if(!this.boards.hasBoard(data.boardId)) {
                    console.log('No "board" in socket(CREATE - OBJECT)')
                    break
                }
                if(!data.command.boardObject) {
                    console.log('No "boardObject" in socket(CREATE - OBJECT)')
                    break
                }
                const board = this.boards.getBoard(data.boardId);
                board!.objects.create(data.command.boardObject);
                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                console.log("Object created successfully - " + data.command.boardObject.id);
                break
            }
            case "updateBoardObject": {
                if(!this.boards.hasBoard(data.boardId)) {
                    console.log('No "board" in socket(UPDATE - OBJECT)')
                }
                if(!data.command.updates) {
                    console.log('No "updates" in socket(UPDATE - OBJECT)')
                }
                const board = this.boards.getBoard(data.boardId);
                board!.objects.update(data.command.boardObjectId, data.command.updates);
                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                console.log("Object updated successfully - " + data.command.boardObjectId)
                break
            }
            case "deleteBoardObject": {
                if(!this.boards.hasBoard(data.boardId)) {
                    console.log('No "board" in socket(DELETE - OBJECT)')
                }
                if(!data.command.boardObjectId) {
                    console.log('No "boardObjectId" in socket(DELETE - OBJECT)')
                }
                const board = this.boards.getBoard(data.boardId);
                board!.objects.delete(data.command.boardObjectId);
                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                console.log("Object deleted - " + data.command.boardObjectId)
                break
            }
            default:
                console.log("Default case for boardObjectCommand")
        }
    }

    @SubscribeMessage("boardPresenceCommand")
    async handleSocketCommand(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardObjectCommandDTO,
    ) {
        switch (data.command.type){
            case ("objectPreview"): {
                socket.broadcast.to(data.boardId).emit("boardPresenceCommand", data);
                break;
            }
            case ("cursorMovement"): {
                //TODO socket.broadcast.to(data.boardId).emit("boardPresenceCommand", data);
                break;
            }
            default: {
                console.log("Default response - cursor move")
                break;
            }
        }
    }

    
}

