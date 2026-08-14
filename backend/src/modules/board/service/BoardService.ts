import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, OnApplicationShutdown } from "@nestjs/common";
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
        board!.applyUpdate(newData);

        this.dirtyQueue.add(id);
        console.log("Added to queue")
        return board;
    }
    getBoardFromServer(id: string) {
        return this.boards.get(id);
    }

    async getBoardFromDatabase(id: string): Promise<BoardManager> {
        try {
            const retrievedBoard = await this.boardRepository.findById(id);
            if(retrievedBoard !== null) {
                return BoardManager.fromPersistence(retrievedBoard);
            } else {
                throw new NotFoundException("Board not found within database with id: " + id + "(GET)")
            }
        } catch {
            throw new InternalServerErrorException("Something went wrong while getting board with id: " + id + "(GET)")
        }
    }

    hasBoardInServer(id: string) {
        return this.boards.has(id);
    }

    async hasBoardInDatabase(id: string) {
        try {
            return await this.boardRepository.existsById(id);
        } catch {
            throw new NotFoundException("Board not found within database with id: " + id + "(HAS)")
        }
    }

    async deleteBoard(id: string) {
        try {
            await this.boardRepository.deleteBoard(id);
            return this.boards.delete(id);
        } catch {
            throw new NotFoundException("Board not found within database with id: " + id + "(DELETE)")
        }
    }

    getAllBoardsInServer() {

        return [...this.boards.values()];
    }

    setBoardInServer(boardId: string, board: BoardManager) {
        this.boards.set(boardId, board);
    }

    private async flushToDatabase() {
        console.log("Flushing")
        if (this.dirtyQueue.size === 0) return;

        // Take a snapshot and clear the main queue atomically
        const keysToPersist = Array.from(this.dirtyQueue);
        this.dirtyQueue.clear();

        // Extract current board states from memory for these keys
        console.log("To database - extracting")
        const payload = keysToPersist.flatMap(id => {
            const board = this.boards.get(id);
            return board ? [board] : []; // If found, includes board; if not, flattens to nothing
        });

        if (payload.length === 0) return
        console.log("To database - saving")
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
        console.log('Server shutting down, forcing DB save...');
        clearInterval(this.flushInterval);
        await this.flushToDatabase(); // Push remaining queue before process exits
    }
}