import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BoardCommandDTO } from "./dto/BoardCommandDTO";
import { BoardCommand } from "../../common/enum/BoardCommand";
import { BoardObjectCommandDTO } from "../../models/boardObjectCommandDTO";
import { BoardUser } from "../../models/boardUser";
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
      
  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`CONNECTED - Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`DISCONNECTED - Client id:${client.id} disconnected`);
  }

    @SubscribeMessage("boardCommand")
    async handleBoard(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardCommandDTO
    ) {
        switch (data.type) {
            case BoardCommand.CREATE: {

                const boardId = randomUUID();
                const hostId = randomUUID();
                const board = await this.boards.createBoardAndPersist(boardId, hostId);

                if (!board) {
                    console.error('ERROR:No "board" in socket(CREATE - BOARD)')
                    break;
                }

                const hostUser = new BoardUser(hostId, data.user!.username);

                if (!hostUser) {
                    console.error("ERROR:No user to add, breaking the flow")
                    break;
                }
                board.users.add(hostUser);
                console.log("Host color = " + hostUser.color + "  Host name: " + hostUser.username)
                socket.join(board.id);

                const dto = new BoardStateDTO(hostId, boardId, hostId, board.objects.getAll(), board.users.getAll());

                socket.emit("board-state", dto);
                console.log("Board created with id: " + board.id)
                break;
            }
            case BoardCommand.JOIN:{
                if (!data.id) {
                    console.error('ERROR: No "id" in socket(JOIN - BOARD)')
                    socket.emit("join-board-response", "No boardId sent with socket(missing)")
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.error('ERROR: No "board" in socket(JOIN - BOARD)')
                        socket.emit("join-board-response", "No board with id: " + data.id + " exists.")
                        break
                    }
                        
                    if (!data.user) {
                        console.error('ERROR: No "user" in socket(JOIN - BOARD)')
                        socket.emit("join-board-response", "No user data available (missing)")
                        break
                    }

                    const newUserId = randomUUID();
                    const newUser = new BoardUser(newUserId, data.user.username);
                    
                    board.users.add(newUser);
                    socket.join(board.id);

                    const dto = new BoardStateDTO(newUserId, board.id, board.ownerId, board.objects.getAll(), board.users.getAll());
                    console.log(dto);
                    socket.emit("board-state", dto);
                    socket.broadcast.to(board.id).emit("user-joined-board", newUser)
                    console.log("User " + newUser.username + " joined  the board(with id): " + data.id)
                }
                break;
            }
            case BoardCommand.LEAVE:{
                if (!data.id) {
                    console.error('ERROR: No "id" in socket(LEAVE - BOARD)')
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.error('ERROR: No "board" in socket(JOIN)')
                        break
                    }
                        
                    if (!data.user) {
                        console.error('ERROR: No "user" in socket(JOIN)')
                        break
                    }
                    board.users.remove(data.user.userId);
                    socket.leave(board.id);
                    socket.broadcast.to(board.id).emit("user-left-board", {
                        userId: data.user.userId,
                        username: data.user.username
                    })
                    console.log("User " + data.user.username + " left  the board: " + data.id)
                }
                break;
            }
            case BoardCommand.GET: {
                if (!data.id) {
                    console.error('ERROR: No "id" in socket(GET - BOARD)')
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.error('ERROR: No "board" in socket(GET - BOARD)')
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
                    console.error('ERROR: No "id" in socket(DELETE - BOARD)')
                    break
                }

                if (this.boards.hasBoard(data.id)) {
                    const board = this.boards.getBoard(data.id);

                    if (!board) {
                        console.error('ERROR: No "board" in socket(DELETE - BOARD)')
                        break
                    }
                        
                    if (!data.user) {
                        console.error('ERROR: No "user" in socket(DELETE - BOARD)')
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
                    console.error('ERROR: No "board" in socket(CREATE - OBJECT)')
                    break
                }
                if(!data.command.boardObject) {
                    console.error('ERROR: No "boardObject" in socket(CREATE - OBJECT)')
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
                    console.error('ERROR: No "board" in socket(UPDATE - OBJECT)')
                }
                if(!data.command.updates) {
                    console.error('ERROR: No "updates" in socket(UPDATE - OBJECT)')
                }
                const board = this.boards.getBoard(data.boardId);
                board!.objects.update(data.command.boardObjectId, data.command.updates);
                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                console.log("Object updated successfully - " + data.command.boardObjectId)
                break
            }
            case "deleteBoardObject": {
                if(!this.boards.hasBoard(data.boardId)) {
                    console.error('ERROR: No "board" in socket(DELETE - OBJECT)')
                }
                if(!data.command.boardObjectId) {
                    console.error('ERROR: No "boardObjectId" in socket(DELETE - OBJECT)')
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
            case ("laser"): {
                socket.broadcast.to(data.boardId).emit("boardPresenceCommand", data);
                break
            }
            case ("selection"): {
                socket.broadcast.to(data.boardId).emit("selection", data)
                break;
            }
            default: {
                console.log("Default response - cursor move")
                break;
            }
        }
    }

    
}

