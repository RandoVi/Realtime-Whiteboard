import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { BoardCommandDTO } from "./dto/BoardCommandDTO";
import { BoardObjectPresenceDTO } from "../../models/boardObjectPresenceDTO";
import { BoardObjectEditorDTO } from "../../models/boardObjectEditorDTO";
import { BoardStateDTO } from "./dto/BoardStateDTO";
import { BoardCommandType } from "../../lib/types/BoardCommandType";
import { BoardObjectDTO } from "./dto/BoardObjectDTO";
import { plainToInstance } from "class-transformer";
import { WsRateLimitGuard } from "../../lib/rate-limit/ws-rate-limit.guard";
import { WsConnectionLimitService } from "../../lib/rate-limit/ws-connection-limit-service";
import { RateLimit } from "../../lib/rate-limit/rate-limit.decorator";
import { appError, AppErrorCode } from "../../lib/errors/app.exception";
//import { RateLimit } from "../../common/rate-limit/rate-limit.decorator";


@WebSocketGateway({
    transports: ["websocket"],
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
})
@UseGuards(WsRateLimitGuard)
export class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    constructor(
        private readonly boards: BoardService,
        private readonly connectionLimit: WsConnectionLimitService,
    ) {}

    private readonly logger = new Logger(BoardGateway.name);

    @WebSocketServer()
    io!: Server;

    afterInit() {
        this.logger.log("Initialized");
    }
        
    handleConnection(client: Socket) {
        const userId = client.data.userId;

        this.logger.log(`CONNECTED - Client id: ${client.id} connected`);
        const allowed =this.connectionLimit.connect(userId, 10);

        if (!allowed) {
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId;

        this.connectionLimit.disconnect(userId);
        this.logger.log(`DISCONNECTED - Client id: ${client.id} disconnected`);
    }
    // @RateLimit({
    //     limit: 1,
    //     windowMs: 1_000,
    // })
    @SubscribeMessage("boardCommand")
    async handleBoard(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardCommandDTO
    ) {
        switch (data.type) {
            case BoardCommandType.CREATE: {
                
                if (!data.user) {
                    throw appError(AppErrorCode.NO_DATA, {
                        details: "No user data provided"
                    })
                }
                const board = await this.boards.createBoardAndPersist(data.user.username);

                socket.join(board.id);

                const dto = new BoardStateDTO(board.ownerId, board.id, board.ownerId, board.objects.getAll(), board.users.getAll());

                socket.emit("board-state", dto);
                this.logger.log(`Board created with id: ${board.id}`);
                break;
            }
            case BoardCommandType.JOIN:{
                if (!data.id || !data.user) {
                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////////////////////////////////////////////////////////////////////
                    socket.emit("join-board-response", "Malformed data sent with socket")

                    throw appError(AppErrorCode.NO_DATA, {
                        details: "Malformed data provided for joining",
                        context: {
                            dataId: data.id,
                            dataUserId: data.user?.userId
                        }
                    })
                }

                const board = await this.boards.getBoardOrThrow(data.id);

                const newUser = await this.boards.upsertUserInBoard(data.id, data.user.username);

                const dto = new BoardStateDTO(newUser.userId, board.id, board.ownerId, board!.objects.getAll(), board.users.getAll());

                socket.join(board!.id);
                socket.emit("board-state", dto);
                socket.broadcast.to(board!.id).emit("user-joined-board", newUser)
                this.logger.log(`User ${newUser!.username} joined board ${data.id}`);
                break;
            }
            case BoardCommandType.LEAVE:{
                if (!data.id || !data.user) {
                    throw appError(AppErrorCode.NO_DATA, {
                        details: "No data provided for leaving the board",
                        context: {
                            boardId: data.id,
                            userId: data.user?.userId
                        }
                    });
                }

                const board = this.boards.getBoardFromServer(data.id);
                    
                await this.boards.deleteUserFromBoard(data.id, data.user.userId);
                
                socket.leave(board.id);
                socket.broadcast.to(board.id).emit("user-left-board", {
                    userId: data.user.userId,
                    username: data.user.username
                })
                this.logger.log("User" + data.user.username + " left  the board with id: " + data.id)
                break;
            }
            case BoardCommandType.GET: {
                if (!data.id) {
                    throw appError(AppErrorCode.NO_DATA, {
                        details: "No board id provided",
                    })
                }
                const board = await this.boards.getBoardOrThrow(data.id);

                socket.emit("get-board-response", {
                    boardId: board.id,
                    hostId: board.ownerId,
                })
                break;
            }
            case BoardCommandType.DELETE:
                if (!data.id) {
                    throw appError(AppErrorCode.NO_DATA, {
                        details: "No board id provided",
                    })
                }

                const board = await this.boards.getBoardOrThrow(data.id);

                /* This is missing a validation check whether or not the request is valid, but it was kind of pointless anyway since they are deleted on expiration? */
                this.boards.deleteBoardFromServer(data.id)

                this.io.in(board.id).socketsLeave(board.id);

                this.logger.log(`Board ${board.id} deleted, user sockets removed`);

                break;
            default:
                this.logger.log("HandleBoard default response, no commands given")
                break;
        }
    }
    // @RateLimit({
    //     limit: 3,
    //     windowMs: 1_000,
    // })
    @SubscribeMessage("boardObjectCommand")
    async handleObjectCommand(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardObjectEditorDTO,
    ) {
        switch (data.command.type){
            case "createBoardObject": {

                const dto = plainToInstance(
                    BoardObjectDTO,
                    data.command.boardObject
                );

                const board = await this.boards.createObjectInBoard(data.boardId, dto);

                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                break
            } case "updateBoardObject": {

                const dto = plainToInstance(
                    BoardObjectDTO,
                    {
                        id: data.command.boardObjectId,
                        ...data.command.updates
                    }
                );

                const board = await this.boards.updateObjectInBoard(data.boardId, dto);
                
                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                break
            }
            case "deleteBoardObject": {

                const board = await this.boards.deleteObjectInBoard(data.boardId, data.command.boardObjectId);

                socket.broadcast.to(board.id).emit("boardObjectCommand", data);
                break
            }

            case "bringBoardObjectToFront": {
                const board = this.boards.getBoardFromServer(data.boardId)

                this.boards.moveObjectToFront(board.id, data.command.boardObjectId);

                socket.broadcast.to(board.id).emit("boardObjectCommand", data);
                break
            }
            default: {
                this.logger.log("Unknown command for boardObjectCommand")
            }
                
        }
    }
    @RateLimit({
        limit: 60,
        windowMs: 1_000,
    })
    @SubscribeMessage("boardPresenceCommand")
    async handleSocketCommand(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardObjectPresenceDTO,
    ) {
        if (data) {
            if(!data.command) {
                throw appError(AppErrorCode.NO_DATA, {
                    details: "No command provided",
                })
            }
            const board = this.boards.getBoardFromServer(data.boardId)

            socket.broadcast.to(board.id).emit("boardPresenceCommand", data);
        } else {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for presence command",
            })
        }
    }
}



