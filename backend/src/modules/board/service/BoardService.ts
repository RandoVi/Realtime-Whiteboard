import {  Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import { BoardManager } from "../../../managers/BoardManager";
import { BoardRepository } from "../repository/BoardRepository";
import { IDLE_TIMEOUT } from "../../../lib/idle-timeout";
import { BoardUser } from "../../../models/boardUser";
import { ObjectChange, UserChange } from "../../../lib/types/BoardChanges";
import { randomUUID } from "crypto";
import { BoardObjectDTO } from "../dto/BoardObjectDTO";
import { validateObjectType } from "../../../lib/util/validateObjectType";
import { validateObjectUpdate } from "../../../lib/util/validateObjectUpdate";
import { appError, AppErrorCode } from "../../../lib/errors/app.exception";

@Injectable()
export class BoardService implements OnApplicationShutdown {

    private readonly logger = new Logger(BoardService.name);
    
    private static readonly FLUSH_INTERVAL = 15_000;
    private static readonly CLEANUP_INTERVAL = 30_000;
    private static readonly DB_EXPIRATION_TIME = 2 * 60 * 1000;

    // Reference for clearing the interval on shutdown
    private flushInterval: NodeJS.Timeout;
    private cleanupInterval: NodeJS.Timeout;
    private cleanupDatabaseInterval: NodeJS.Timeout;

    constructor(
        private readonly boardRepository: BoardRepository,
    ) {
        // Persist dirty boards every 3 seconds
        this.flushInterval = setInterval(
            () => this.flushToDatabase(),
            BoardService.FLUSH_INTERVAL
        );

        // Check for idle boards every minute
        this.cleanupInterval = setInterval(
            () => this.cleanupIdleBoards(),
            BoardService.CLEANUP_INTERVAL
        );

        this.cleanupDatabaseInterval = setInterval(
        () => this.deleteExpiredBoards(),
        BoardService.DB_EXPIRATION_TIME // every 15 minutes
    );
    }

    private readonly boards = new Map<string, BoardManager>();
    private readonly creationLocks = new Set<string>();

    private readonly dirtyObjects = new Map<string, ObjectChange>();
    private readonly dirtyUsers = new Map<string, UserChange>();
    private readonly dirtyActivity = new Map<string, Date>();

    private objectChangeKey(boardId: string, objectId: string, type: ObjectChange['type'],): string {
        return `${boardId}:${objectId}:${type}`;
    }

    private userChangeKey(boardId: string,userId: string,): string {
        return `${boardId}:${userId}`;
    }

    async createBoardAndPersist(username: string): Promise<BoardManager> {

        const ownerId = randomUUID();

        if (this.creationLocks.has(ownerId)) {
            throw appError(AppErrorCode.INVALID_INPUT, {
                details: "A board is already being created for the same host",
                context: {
                    ownerId: ownerId
                }
            })
        }

        this.creationLocks.add(ownerId);

        try {
            const savedBoard = await this.boardRepository.create(randomUUID(), ownerId);
            const newBoard = new BoardManager(savedBoard.id, savedBoard.ownerId);
            const newUser = new BoardUser(ownerId, username);

            this.boards.set(newBoard.id, newBoard);

            newBoard.addUser(newUser)

            const key = this.userChangeKey(newBoard.id, newUser.userId);

            this.dirtyUsers.set(key, {
                type: 'create',
                boardId: newBoard.id,
                user: newUser,
            });

            return newBoard;

        } finally {
            this.creationLocks.delete(ownerId);
        }
    }

    async upsertUserInBoard(boardId: string, username: string) : Promise<BoardUser>  {
        if (!username || !boardId) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for updating/inserting user",
                context: {
                    boardId: boardId,
                    username: username
                }
            })
        }

        const board = this.boards.get(boardId);
        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "Failed to retrieve board",
                context: {
                    boardId: boardId
                }
            })
        }

        const user = new BoardUser(
            randomUUID(),
            username,
        );

        board.upsertUser(user);

        const key = this.userChangeKey(board.id, user.userId);

        this.dirtyUsers.set(key, {
            type: 'create',
            boardId: board.id,
            user,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );

        return user;
    }

    async deleteUserFromBoard(boardId: string, userId: string) : Promise<boolean> {
        if (!boardId || !userId) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for removing user",
                context: {
                    boardId: boardId,
                    userId: userId
                }
            })
        }
        const board = this.boards.get(boardId);
        
        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: boardId
                }
            })
        }

        board.deleteUser(userId);

        const key = this.userChangeKey(board.id, userId);

        this.dirtyUsers.set(key, {
            type: 'delete',
            boardId: board.id,
            userId,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );

        return true;
    }

    async createObjectInBoard(boardId: string, objectData: BoardObjectDTO) {
        if (!boardId || !objectData) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for creating object",
                context: {
                    boardId: boardId,
                    objectDataType: objectData.type
                }
            })
        }

        const board = this.boards.get(boardId);
        
        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: boardId
                }
            })
        }
        const existing = board.objects.get(objectData.id);

        if (existing) {
            throw appError(AppErrorCode.ALREADY_EXISTS, {
                details: "Object with id already exists",
                context: {
                    boardId: boardId,
                    objectId: objectData.id,
                    existingObjectType: existing.type,
                    newObjectType: objectData.type,
                }
            })
        }
        const verifiedObject = validateObjectType(objectData);

        board.addObject(verifiedObject);

        const key = this.objectChangeKey(board.id, objectData.id, 'create');

        this.dirtyObjects.set(key, {
            type: 'create',
            boardId: board.id,
            object: verifiedObject,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );

        return board;
    }

    async updateObjectInBoard(boardId: string, changes: Partial<BoardObjectDTO> & { id: string}) {

        if (!boardId || !changes) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for updating object",
                context: {
                    boardId: boardId,
                    objectId: changes.id
                }
            })
        }

        const board = this.boards.get(boardId);

        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: boardId
                }
            })
        }

        const existing = board.objects.get(changes.id);

        if (!existing) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No object with id in server",
                context: {
                    objectId: changes.id
                }
            })
        }
        if (changes.type !== undefined && existing.type !== changes.type) {
            throw appError(AppErrorCode.INVALID_INPUT, {
                details: "Update contains invalid type for existing object",
                context: {
                    boardId: boardId,
                    objectId: changes.id,
                    existingType: existing.type,
                    newType: changes.type
                }
            })
        }
        //  delete id from the object
        const { id, ...fields } = changes;

        const update = Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined)
        );

        validateObjectUpdate(existing, update);

        board.applyObjectUpdate({id, ...update});
        // Get the now-updated object
        const object = board.objects.get(id)!;


        const key = this.objectChangeKey(board.id, object.id, 'update');

        this.dirtyObjects.set(key, {
            type: 'update',
            boardId: board.id,
            object,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );

        return board;
    }

    async moveObjectToFront(boardId: string, objectId: string) {
        if (!boardId || !objectId) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for moving object to front",
                context: {
                    boardId: boardId,
                    objectId: objectId
                }
            })
        }
        const board = this.boards.get(boardId);
        
        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: boardId
                }
            })
        }

        board.moveObjectToFrontInObjects(objectId);

        const key = this.objectChangeKey(board.id, objectId, 'reorder');

        this.dirtyObjects.set(key, {
            type: 'reorder',
            boardId: board.id,
            objectId,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );
    }

    async deleteObjectInBoard(boardId: string, objectId: string) : Promise<BoardManager> {
        if (!boardId || !objectId) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No data provided for deleting object",
                context: {
                    boardId: boardId,
                    objectId: objectId
                }
            })
        }
        const board = this.boards.get(boardId);
        
        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: boardId
                }
            })
        }

        const existing = board.objects.get(objectId);

        if (!existing) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No object with id in board",
                context: {
                    boardId,
                    objectId,
                },
            });
        }

        board.deleteObject(objectId);

        const key = this.objectChangeKey(board.id, objectId, 'delete');

        this.dirtyObjects.set(key, {
            type: 'delete',
            boardId: board.id,
            objectId,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );

        return board;
    }

    getBoardFromServer(id: string): BoardManager {
        const board = this.boards.get(id);

        if (!board) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: id,
                },
            });
        }

        return board;
    }

    hasBoardInServer(id: string) {
        return this.boards.has(id);
    }

    async getBoardFromDatabase(id: string): Promise<BoardManager> {
            const retrievedBoard = await this.boardRepository.findByCustomId(id);
            if(retrievedBoard !== null) {

                const manager = BoardManager.fromPersistence(retrievedBoard);
                this.boards.set(manager.id, manager);

                return manager;
            } else {
                throw appError(AppErrorCode.NOT_FOUND, {
                    details: "No board with id in database",
                    context: {
                        boardId: id
                    }
                })
            }
    }

    async getBoardOrThrow(boardId: string): Promise<BoardManager> {

        if (!boardId) {
            throw appError(AppErrorCode.NO_DATA, {
                details: "No board id provided",
                context: {
                    boardId: boardId,
                }
            })
        }
        const board = this.boards.get(boardId);

        if (!board) {
            return this.getBoardFromDatabase(boardId);
        }
        return board;
    }

    async hasBoardInDatabase(id: string) {
        try {
            return await this.boardRepository.existsByCustomId(id);
        } catch {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "Failed to verify board existence in database, likely does not exist",
                context: {
                    boardId: id
                }
            })
        }
    }

    async deleteBoardFromServer(id: string) {
        const deleted = this.boards.delete(id);

        if (!deleted) {
            throw appError(AppErrorCode.NOT_FOUND, {
                details: "No board with id in server",
                context: {
                    boardId: id,
                },
            });
        }
    }

    getAllBoardsInServer() {

        return [...this.boards.values()];
    }

    private isFlushing = false;

    private async flushToDatabase() {
        if (this.isFlushing) {
            return;
        }

        this.isFlushing = true;

        try {
        const objectChanges = Array.from(this.dirtyObjects.entries());
        const userChanges = Array.from(this.dirtyUsers.entries());

        const activityUpdates = Array.from(this.dirtyActivity.entries()).map(([boardId, lastActivity]) => ({boardId,lastActivity,}));

        this.dirtyObjects.clear();
        this.dirtyUsers.clear();
        this.dirtyActivity.clear();


        const createdObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'create');

        const reorderedObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'reorder');

        const updatedObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'update');

        const deletedObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'delete');

        if (createdObjects.length > 0) {
            try {
                await this.boardRepository.saveManyCreatedObjects(createdObjects);
            } catch (error) {

                this.requeueObjects(objectChanges, "create");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save created objects. Re-queueing...  ${error}`,
                })
            }
        }
        if (reorderedObjects.length > 0) {
            try {
                await this.boardRepository.saveManyReorderedObjects(reorderedObjects);
            } catch (error) {
                this.requeueObjects(objectChanges, "reorder");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save created objects. Re-queueing...  ${error}`,
                })
            }
        }

        if (updatedObjects.length > 0) {
            try {
                await this.boardRepository.saveManyUpdatedObjects(updatedObjects);
            } catch (error) {
                this.requeueObjects(objectChanges, "update");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save created objects. Re-queueing...  ${error}`,
                })
            }
        }

        

        if (deletedObjects.length > 0) {
            try {
                await this.boardRepository.saveManyDeletedObjects(deletedObjects);
            } catch (error) {
                this.requeueObjects(objectChanges, "delete");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save created objects. Re-queueing...  ${error}`,
                })
            }
        }
            
        const createdUsers = userChanges
            .map(([, change]) => change)
            .filter((change) => change.type === "create");

        const updatedUsers = userChanges
            .map(([, change]) => change)
            .filter((change) => change.type === "update");

        const deletedUsers = userChanges
            .map(([, change]) => change)
            .filter((change) => change.type === "delete");

        if (createdUsers.length > 0) {
            try {
                await this.boardRepository.saveManyCreatedUsers(createdUsers);
            } catch (error) {
                this.requeueUsers(userChanges, "create");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save created users. Re-queueing...  ${error}`,
                })
            }
        }

        if (updatedUsers.length > 0) {
            try {
                await this.boardRepository.saveManyUpdatedUsers(updatedUsers);
            } catch (error) {
                this.requeueUsers(userChanges, "update");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save updated users. Re-queueing...  ${error}`,
                })
            }
        }

        if (deletedUsers.length > 0) {
            try {
                await this.boardRepository.saveManyDeletedUsers(deletedUsers);
            } catch (error) {
                this.requeueUsers(userChanges, "delete");

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save deleted users. Re-queueing...  ${error}`,
                })
            }
        }

        if (activityUpdates.length > 0) {
            try {
                await this.boardRepository.saveManyActivityUpdates(activityUpdates);

            } catch (error) {
                this.requeueActivities(activityUpdates);

                throw appError(AppErrorCode.TRANSFORMATION_FAILED, {
                    details: `Failed to save activity updates. Re-queueing...  ${error}`,
                })
            }
        }
        } finally {
            this.isFlushing = false;
        }
    }

    async onApplicationShutdown() {
        this.logger.log('Server shutting down...');

        clearInterval(this.flushInterval);
        clearInterval(this.cleanupInterval);
        clearInterval(this.cleanupDatabaseInterval);

        await this.flushToDatabase();
    }

    private async cleanupIdleBoards() {
        const now = Date.now();
        
        for (const board of this.boards.values()) {
            if (
                board.users.getAll().length === 0 &&
                now - board.lastActivity.getTime() > IDLE_TIMEOUT
            ) {
                await this.deleteBoardFromServer(board.id);
            }
        }
    }

    private async deleteExpiredBoards() {
        const cutoff = new Date(
            Date.now() - BoardService.DB_EXPIRATION_TIME
        );
        // Give last non expired date basically
        const result = await this.boardRepository.deleteExpiredBoards(cutoff);
        this.logger.log(`Deleted ${result.deletedCount} expired boards.`);
    }

    private requeueObjects(changes: [string, ObjectChange][], type: string) {
        for (const [key, change] of changes) {
            if ( change.type === type && !this.dirtyObjects.has(key)) {
                this.dirtyObjects.set(key, change);
            }
        }
    }

    private requeueUsers(changes: [string, UserChange][], type: string) {
        for (const [key, change] of changes) {
            if ( change.type === type && !this.dirtyUsers.has(key)) {
                this.dirtyUsers.set(key, change);
            }
        }
    }
    
    private requeueActivities(changes: {boardId: string, lastActivity: Date}[]) {
        for (const { boardId, lastActivity } of changes) {
                if (!this.dirtyActivity.has(boardId)) {
                    this.dirtyActivity.set(boardId, lastActivity);
                }
            }
    }
}
