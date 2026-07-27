import { Injectable } from "@nestjs/common";
import { BoardManager } from "../../../managers/BoardManager";

@Injectable()
export class BoardService {

    private readonly boards = new Map<string, BoardManager>();

    createBoard(id: string, name: string) {

        if (this.boards.has(id)) {
            throw new Error("Board already exists");
        }

        const board = new BoardManager(id, name);

        this.boards.set(id, board);

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

}