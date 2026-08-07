import { BadRequestException, ConflictException, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { BoardManager } from "../../../managers/BoardManager";
import { BoardRepository } from "../repository/BoardRepository";
import { BoardUpdateDTO } from "../dto/BoardUpdateDTO";

@Injectable()
export class BoardService implements OnApplicationShutdown {

    // Reference for clearing the interval on shutdown
    private flushInterval: NodeJS.Timeout;
    constructor (private readonly boardRepository: BoardRepository){
        this.flushInterval = setInterval(() => this.flushToDatabase(), 3000);
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

    async updateBoardState(boardId: string, newData: BoardUpdateDTO) {

        if (!this.boards.has(boardId)) {
            throw new BadRequestException("Cannot update board with this id, it does not exist (server)")
        }
        const board = this.boards.get(boardId);
        board!.applyUpdate(newData);

        this.dirtyQueue.add(boardId);

        return board;
    }

    getBoard(id: string) {

        return this.boards.get(id);
    }

    hasBoard(id: string) {

        return this.boards.has(id);
    }

    deleteBoard(id: string) {

        return this.boards.delete(id);
    }

    getBoards() {

        return [...this.boards.values()];
    }

    private async flushToDatabase() {
        if (this.dirtyQueue.size === 0) return;

        // Take a snapshot and clear the main queue atomically
        const keysToPersist = Array.from(this.dirtyQueue);
        this.dirtyQueue.clear();

        // Extract current board states from memory for these keys
        const payload = keysToPersist.flatMap(id => {
            const board = this.boards.get(id);
            return board ? [board] : []; // If found, includes board; if not, flattens to nothing
        });

        if (payload.length === 0) return

        try {
            await this.boardRepository.saveManyBoardUpdates(payload);
            console.log(`Successfully flushed ${payload.length} boards to DB.`);
        } catch (error) {
            console.error('Failed to flush to DB. Re-queueing pending updates...', error);

            // Put the failed keys back into the queue
            keysToPersist.forEach(id => this.dirtyQueue.add(id));
        }
    }
    async onApplicationShutdown() {
        console.log('Server shutting down, forcing DB flush...');
        clearInterval(this.flushInterval);
        await this.flushToDatabase(); // Push remaining queue before process exits
    }
}