import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from "@nestjs/websockets";

import { BoardService } from "./service/BoardService";
import { Server, Socket } from "socket.io";
import { BadRequestException, InternalServerErrorException, Logger, NotFoundException, UseGuards } from "@nestjs/common";
import { BoardCommandDTO } from "./dto/BoardCommandDTO";
import { BoardObjectPresenceDTO } from "../../models/boardObjectPresenceDTO";
import { BoardObjectEditorDTO } from "../../models/boardObjectEditorDTO";
import { BoardStateDTO } from "./dto/BoardStateDTO";
import { BoardCommandType } from "../../common/types/BoardCommandType";
import { BoardObjectDTO } from "./dto/BoardObjectDTO";
import { plainToInstance } from "class-transformer";
import { WsRateLimitGuard } from "../../common/rate-limit/ws-rate-limit.guard";
import { WsConnectionLimitService } from "../../common/rate-limit/ws-connection-limit-service";
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
        this.logger.log(`DISCONNECTED - Client id:${client.id} disconnected`);
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
                
                if (!data.user || !data.user.username) {
                    throw new BadRequestException("No user data provided while creating board")
                }
                const board = await this.boards.createBoardAndPersist(data.user.username);

                if (!board) {
                    console.error('SERVER: Failed to create board at CREATE')
                    break;
                }

                socket.join(board.id);

                const dto = new BoardStateDTO(board.ownerId, board.id, board.ownerId, board.objects.getAll(), board.users.getAll());

                socket.emit("board-state", dto);
                console.log("SERVER: Board created with id: " + board.id)
                break;
            }
            case BoardCommandType.JOIN:{
                if (!data.id) {
                    console.error('SERVER: No "id" in socket(JOIN - BOARD)')
                    socket.emit("join-board-response", "No boardId sent with socket(missing)")
                    break
                }

                let board = this.boards.getBoardFromServer(data.id);

                if (!board) {
                    console.error('SERVER: WARNING: No "board in server" in socket(JOIN - BOARD) - looking in db')
                    const exists = await this.boards.hasBoardInDatabase(data.id);

                    if (exists) {
                        console.log("SERVER: Board exists in database - fetching")
                        board = await this.boards.getBoardFromDatabase(data.id);
                        // console.log("Board found with: " + board.id, board.ownerId, board. lastActivity, board.users.toJSON(), board.objects.toJSON())
                    } else {
                        console.log("SERVER: No board exists in db")
                        break
                    }
                }
                
                    
                if (!data.user) {
                    console.error('SERVER:  No "user" in socket(JOIN - BOARD)')
                    socket.emit("join-board-response", "No user data available (missing)")
                    break
                }
                const newUser = await this.boards.upsertUserInBoard(data.id, data.user.username);

                if(!newUser) {
                    throw new InternalServerErrorException("Failed to updateBoardUserState")
                }
                const dto = new BoardStateDTO(newUser.userId, board!.id, board!.ownerId, board!.objects.getAll(), board!.users.getAll());
                //console.log(dto);
                socket.join(board.id);
                socket.emit("board-state", dto);
                socket.broadcast.to(board!.id).emit("user-joined-board", newUser)
                console.log("SERVER: User " + newUser.username + " joined  the board(with id): " + data.id)
                break;
            }
            case BoardCommandType.LEAVE:{
                if (!data.id) {
                    console.error('SERVER:  No "id" in socket(LEAVE - BOARD)')
                    break
                }

                if (this.boards.hasBoardInServer(data.id)) {
                    const board = this.boards.getBoardFromServer(data.id);

                    if (!board) {
                        console.error('SERVER:  No "board" in socket(JOIN)')
                        break
                    }
                        
                    if (!data.user) {
                        console.error('SERVER:  No "user" in socket(JOIN)')
                        break
                    }

                    await this.boards.removeUserFromBoard(data.id, data.user.userId);
                    socket.leave(board.id);
                    socket.broadcast.to(board.id).emit("user-left-board", {
                        userId: data.user.userId,
                        username: data.user.username
                    })
                    console.log("SERVER: User " + data.user.username + " left  the board: " + data.id)
                }
                break;
            }
            case BoardCommandType.GET: {
                if (!data.id) {
                    console.error('SERVER: ERROR: No "id" in socket(GET - BOARD)')
                    break
                }

                if (this.boards.hasBoardInServer(data.id)) {
                    const board = this.boards.getBoardFromServer(data.id);

                    if (!board) {
                        console.error('SERVER: ERROR: No "board" in socket(GET - BOARD)')
                        break
                    }
                    socket.emit("get-board-response", {
                        boardId: board.id,
                        hostId: board.ownerId,
                    })
                    console.log("SERVER: Emitted 'get-board-response' with board data")
                    }
                break;
                }
            case BoardCommandType.DELETE:
                if (!data.id) {
                    console.error('SERVER:  No "id" in socket(DELETE - BOARD)')
                    break
                }

                if (this.boards.hasBoardInServer(data.id)) {
                    const board = this.boards.getBoardFromServer(data.id);

                    if (!board) {
                        console.error('SERVER:  No "board" in socket(DELETE - BOARD)')
                        break
                    }
                        
                    if (!data.user) {
                        console.error('SERVER: ERROR: No "user" in socket(DELETE - BOARD)')
                        break
                    }
                    this.boards.removeBoardFromServer(data.id)

                    this.io.in(board.id).socketsLeave(board.id);
                    console.log("SERVER: Board deleted, user sockets removed")
                }
                break;
            default:
                console.log("SERVER: Board default response, no commands")
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
                if(!this.boards.hasBoardInServer(data.boardId)) {
                    console.error('SERVER:  No "board" in socket(CREATE - OBJECT)')
                    break
                }
                if(!data.command.boardObject) {
                    console.error('SERVER:  No "boardObject" in socket(CREATE - OBJECT)')
                    break
                }
                const board = this.boards.getBoardFromServer(data.boardId);
                if (!board) {
                    console.log("SERVER: No board after fetching, breaking")
                    break
                }
                const dto = plainToInstance(
                    BoardObjectDTO,
                    data.command.boardObject
                );
                await this.boards.createObjectInBoard(board.id, dto);

                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                break
            }
            case "updateBoardObject": {
                
                if(!this.boards.hasBoardInServer(data.boardId)) {
                    console.error('SERVER:  No "board" in socket(UPDATE - OBJECT)')
                    break
                }
                if(!data.command.updates) {
                    console.error('SERVER:  No "updates" in socket(UPDATE - OBJECT)')
                    break
                }
                if(!data.command.boardObjectId) {
                    console.error('SERVER: No "boardObjectId" in socket(UPDATE - OBJECT)')
                    break
                }
                const board = this.boards.getBoardFromServer(data.boardId);
                if (!board) {
                    console.log("SERVER: No board after fetching, breaking")
                    break
                }

                const dto = plainToInstance(
                    BoardObjectDTO,
                    {
                        id: data.command.boardObjectId,
                        ...data.command.updates
                    }
                );

                await this.boards.updateObjectInBoard(board!.id, dto);
                
                socket.broadcast.to(board!.id).emit("boardObjectCommand", data);
                break
            }
            case "deleteBoardObject": {
                if(!this.boards.hasBoardInServer(data.boardId)) {
                    console.error('ERROR: No "board" in socket(DELETE - OBJECT)')
                    break
                }
                if(!data.command.boardObjectId) {
                    console.error('ERROR: No "boardObjectId" in socket(DELETE - OBJECT)')
                    break
                }
                const board = this.boards.getBoardFromServer(data.boardId)
                if (!board) {
                    throw new NotFoundException("Board not found in server @ deleteBoardObject")
                }
                this.boards.deleteObjectInBoard(board.id, data.command.boardObjectId);

                socket.broadcast.to(board.id).emit("boardObjectCommand", data);
                break
            }

            case "bringBoardObjectToFront": {
                if(!this.boards.hasBoardInServer(data.boardId)) {
                    console.error('ERROR: No "board" in socket(BRING TO FRONT - OBJECT)')
                    break
                }
                if(!data.command.boardObjectId) {
                    console.error('ERROR: No "boardObjectId" in socket(BRING TO FRONT - OBJECT)')
                    break
                }
                const board = this.boards.getBoardFromServer(data.boardId)
                if (!board) {
                    throw new NotFoundException("Could not retrieve board from server @ bringBoardObjectToFront")
                }
                this.boards.moveObjectToFront(board.id, data.command.boardObjectId);

                socket.broadcast.to(board.id).emit("boardObjectCommand", data);
                break
            }
            default: {
                console.log("SERVER: Unknown command for boardObjectCommand")
            }
                
        }
    }
    // @RateLimit({
    //     limit: 60,
    //     windowMs: 1_000,
    // })
    @SubscribeMessage("boardPresenceCommand")
    async handleSocketCommand(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: BoardObjectPresenceDTO,
    ) {
        if (data) {
            if(!this.boards.hasBoardInServer(data.boardId)) {
                    throw new NotFoundException ('No "board" in socket(BRING TO FRONT - OBJECT)')
            }
            if(!data.command) {
                throw new BadRequestException('No "command" in socket(BRING TO FRONT - OBJECT)')
            }
            const board = this.boards.getBoardFromServer(data.boardId)
            if (!board) {
                throw new NotFoundException("Could not retrieve board from server @ bringBoardObjectToFront")
            }
            if (data.command.type === "objectPreview") {
                //if (data.command.)
            }
            /////////////////////////////////////////////////Check if user exists in board before relaying
            socket.broadcast.to(data.boardId).emit("boardPresenceCommand", data);
        } else {
            console.warn("SERVER: No data found to transmit @handleSocketCommand")
        }
    }
}



