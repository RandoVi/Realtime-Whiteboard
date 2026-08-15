import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, OnApplicationShutdown } from "@nestjs/common";
import { BoardManager } from "../../../managers/BoardManager";
import { BoardRepository } from "../repository/BoardRepository";
import { BoardUpdateDTO } from "../dto/BoardUpdateDTO";
import { IDLE_TIMEOUT } from "../../../common/idle-timeout";

@Injectable()
export class BoardService implements OnApplicationShutdown {

    private static readonly FLUSH_INTERVAL = 3_000;
    private static readonly CLEANUP_INTERVAL = 30_000;
    private static readonly DB_EXPIRATION_TIME = 1 * 60 * 1000;

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

    private dirtyQueue: Set<string> = new Set();

    async createBoardAndPersist(id: string, ownerId: string): Promise<BoardManager> {

        if (this.boards.has(ownerId)) {
            throw new ConflictException('User with id: ' + ownerId +' has already created a board')
        }
        if (this.creationLocks.has(ownerId)) {
            throw new ConflictException('Board creation already in progress. Please wait.');
        }

        this.creationLocks.add(ownerId);

        try {
            const savedBoard = await this.boardRepository.create(id, ownerId);
            const newBoard = new BoardManager(savedBoard.id, savedBoard.ownerId);

            this.boards.set(newBoard.id, newBoard);

            return newBoard;
        } finally {
            this.creationLocks.delete(ownerId);
        }
    }

    async updateBoardState(newData: BoardUpdateDTO) {
        if (!newData) {
            throw new BadRequestException("No data in DTO @ updateBoardState")
        }
        console.log("Updating board state")
        if (!this.boards.has(newData.boardId)) {
            throw new BadRequestException("Cannot update board with this id, it does not exist (server)")
        }
        const id = newData.boardId;
        const board = this.boards.get(id);

        board!.lastActivity = new Date();
        board!.applyUpdate(newData);

        this.dirtyQueue.add(id);
        return board;
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
        console.log("-")
        if (this.dirtyQueue.size === 0) return;

        // Take a snapshot and clear the main queue atomically
        const keysToPersist = Array.from(this.dirtyQueue);
        this.dirtyQueue.clear();

        const payload = keysToPersist.flatMap(id => {
            const board = this.boards.get(id);
            return board ? [board] : []; // If found, includes board; if not, flattens to nothing
        });

        if (payload.length === 0) return
        try {
            await this.boardRepository.saveManyBoardUpdates(payload);
            console.log(`Successfully saved ${payload.length} boards to DB.`);
        } catch (error) {
            console.error('Failed to save to DB. Re-queueing pending updates...', error);

            // Put the failed keys back into the queue
            keysToPersist.forEach(id => this.dirtyQueue.add(id));
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
                board.users.getAll.length === 0 &&
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