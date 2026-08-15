import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, OnApplicationShutdown } from "@nestjs/common";
import { BoardManager } from "../../../managers/BoardManager";
import { BoardRepository } from "../repository/BoardRepository";
import { IDLE_TIMEOUT } from "../../../common/idle-timeout";
import { BoardUser } from "../../../models/boardUser";
import { ObjectChange, UserChange } from "../../../common/types/BoardChanges";
import { randomUUID } from "crypto";
import { BoardObjectDTO } from "../dto/BoardObjectDTO";
import { validateObjectType } from "../../../common/util/validateObjectType";
import { validateObjectUpdate } from "../../../common/util/validateObjectUpdate";

@Injectable()
export class BoardService implements OnApplicationShutdown {

    private static readonly FLUSH_INTERVAL = 5_000;
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
    private readonly dirtyActivity = new Map< string, Date>();

    private objectChangeKey(boardId: string,objectId: string,): string {
        return `${boardId}:${objectId}`;
    }

    private userChangeKey(boardId: string,userId: string,): string {
        return `${boardId}:${userId}`;
    }

    async createBoardAndPersist(): Promise<BoardManager> {

        const ownerId = randomUUID();

        if (this.creationLocks.has(ownerId)) {
            throw new ConflictException('Board creation already in progress. Please wait.');
        }

        this.creationLocks.add(ownerId);

        try {
            const savedBoard = await this.boardRepository.create(randomUUID(), ownerId);
            const newBoard = new BoardManager(savedBoard.id, savedBoard.ownerId);
            const newUser = new BoardUser(ownerId, "Host");

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

    async upsertUserInBoard(boardId: string, username: string) : Promise<BoardUser> {
        if (!username) {
            throw new BadRequestException("No data in DTO @ addUserToBoard")
        }
        if (!this.boards.has(boardId)) {
            throw new BadRequestException("Cannot update board with this id, it does not exist @ addUserToBoard")
        }
        const board = this.boards.get(boardId);
        if (!board) {
            throw new NotFoundException(`Failed to retrieve board from boards manager`)
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

    async removeUserFromBoard(boardId: string, userId: string) : Promise<boolean> {
        if (!userId) {
            throw new BadRequestException("No id provided @ removeUserFromBoard")
        }
        const board = this.boards.get(boardId);
        
        if (!board) {
            throw new NotFoundException("SERVICE:Board not found with id: " + boardId)
        }

        board.removeUser(userId);

        const key = this.userChangeKey(board.id, userId);

        this.dirtyUsers.set(key, {
            type: 'remove',
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
        if (!objectData) {
            throw new BadRequestException("No data in DTO @ createObjectInBoard")
        }

        if (!this.boards.has(boardId)) {
            throw new BadRequestException("Cannot update board with this id, it does not exist (server)")
        }
        const board = this.boards.get(boardId);
        
        if (!board) {
            throw new NotFoundException(`Board not found with id: ${boardId}`)
        }
        const existing = board.objects.get(objectData.id);

        if (existing) {
            throw new ConflictException(`Object already exists for id : ${objectData.id}`)
        }

        const verifiedObject = validateObjectType(objectData);

        board.addObject(verifiedObject);

        const key = this.objectChangeKey(board.id, objectData.id);

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
        if (!changes) {
            throw new BadRequestException("No data in DTO @ updateBoardObjectState")
        }

        const board = this.boards.get(boardId);
        
        if (!board) {
            throw new NotFoundException(`Board not found with id: ${boardId}`)
        }
        const existing = board.objects.get(changes.id);

        if (!existing) {
        throw new NotFoundException(
            `Object not found with id: ${changes.id}`
        );
    }
        if (changes.type !== undefined && existing.type !== changes.type) {
            throw new BadRequestException(
                'Object type cannot be changed'
            );
        }
        // Validate only the fields being changed
        validateObjectUpdate(existing, changes);

        board.applyObjectUpdate(changes);

        // Get the now-updated object
        const object = board.objects.get(changes.id)!;


        const key = this.objectChangeKey(board.id, object.id);

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

    async deleteObjectInBoard(boardId: string, objectId: string) : Promise<boolean> {
        if (!objectId) {
            throw new BadRequestException("No id provided @ removeObjectFromBoard")
        }
        const board = this.boards.get(boardId);
        
        if (!board) {
            throw new NotFoundException("SERVICE:Board not found with id: " + boardId)
        }

        board.removeObject(objectId);

        const key = this.objectChangeKey(board.id, objectId);

        this.dirtyObjects.set(key, {
            type: 'remove',
            boardId: board.id,
            objectId,
        });

        this.dirtyActivity.set(
            board.id,
            board.lastActivity,
        );

        return true;
    }

    getBoardFromServer(id: string) {
        return this.boards.get(id);
    }

    hasBoardInServer(id: string) {
        return this.boards.has(id);
    }

    async getBoardFromDatabase(id: string): Promise<BoardManager> {
        try {
            const retrievedBoard = await this.boardRepository.findByCustomId(id);
            if(retrievedBoard !== null) {

                const manager = BoardManager.fromPersistence(retrievedBoard);
                this.boards.set(manager.id, manager);

                return manager;
            } else {
                throw new NotFoundException("Board not found within database with id: " + id + "(GET)")
            }
        } catch {
            throw new InternalServerErrorException("Something went wrong while getting board with id: " + id + "(GET)")
        }
    }

    async hasBoardInDatabase(id: string) {
        try {
            return await this.boardRepository.existsByCustomId(id);
        } catch {
            throw new NotFoundException("Board not found within database with id: " + id + "(HAS)")
        }
    }

    async removeBoardFromServer(id: string) {
        try {
            this.boards.delete(id);
            console.log(`${id} - board removed from server`);
            return true;
        } catch {
            throw new NotFoundException("Board not found within database with id: " + id + "(DELETE)")
        }
    }

    getAllBoardsInServer() {

        return [...this.boards.values()];
    }

    private async flushToDatabase() {
        console.log('-');

        const objectChanges = Array.from(this.dirtyObjects.entries());
        const userChanges = Array.from(this.dirtyUsers.entries());

        const activityUpdates = Array.from(this.dirtyActivity.entries())
            .map(([boardId, lastActivity]) => ({
            boardId,
            lastActivity,
        }));

        const createdObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'create');

        const updatedObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'update');

        const deletedObjects = objectChanges
            .map(([, change]) => change)
            .filter((change) => change.type === 'remove');
                
        if (objectChanges.length > 0) {
            try {
                //This is snapshotted in the above changes arrays, so we can restore if it fails to persist
                //Clearing it before prevents new activities being deleted while persisting is happening
                this.dirtyObjects.clear();

                await this.boardRepository.saveManyCreatedObjects(createdObjects);
                await this.boardRepository.saveManyUpdatedObjects(updatedObjects);
                await this.boardRepository.saveManyDeletedObjects(deletedObjects);

                console.log(`Saved ${objectChanges.length} object changes`)
            } catch (error) {
                console.error(
                    'Failed to save object changes. Re-queueing...',
                    error
                );

                for (const [key, change] of objectChanges) {
                    //If an update came for the same object during persistence, do not overwrite it with stale data
                    if (!this.dirtyObjects.has(key)) {
                        this.dirtyObjects.set(key, change);
                    }
                    
                }
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
            .filter((change) => change.type === "remove");

        if (userChanges.length > 0) {
            try {
                this.dirtyUsers.clear();

                await this.boardRepository.saveManyCreatedUsers(createdUsers);
                await this.boardRepository.saveManyUpdatedUsers(updatedUsers);
                await this.boardRepository.saveManyDeletedUsers(deletedUsers);

                console.log(`Saved ${userChanges.length} user changes`);
            } catch (error) {
                console.error(
                    "Failed to save user changes. Re-queueing...",
                    error
                );

                for (const [key, change] of userChanges) {
                    if (!this.dirtyUsers.has(key)) {
                        this.dirtyUsers.set(key, change);
                    }
                }
            }
        }

        if (activityUpdates.length > 0) {
            try {
                this.dirtyActivity.clear();
                await this.boardRepository.saveManyActivityUpdates(activityUpdates);

            } catch (error) {
                console.error(
                    'Failed to save activity updates. Re-queueing...',
                    error
                );

                for (const {boardId, lastActivity} of activityUpdates) {
                    if (!this.dirtyActivity.has(boardId)) {
                        this.dirtyActivity.set(boardId, lastActivity);
                    }
                }
            }
        }
            
        }

    async onApplicationShutdown() {
        console.log('Server shutting down...');

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
                await this.removeBoardFromServer(board.id);
            }
        }
    }

    private async deleteExpiredBoards() {
        const cutoff = new Date(
            Date.now() - BoardService.DB_EXPIRATION_TIME
        );
        // Give last non expired date basically
        const result = await this.boardRepository.deleteExpiredBoards(cutoff);
        console.log(`Deleted ${result.deletedCount} expired boards.`);
    }
}
