import { BoardObjectDTO } from "./BoardObjectDTO";
import { BoardUserDTO } from "./BoardUserDTO";

export class BoardStateDTO {
      constructor(
    public readonly userId: string,
    public readonly boardId: string,
    public readonly ownerId: string,
    public readonly objects: BoardObjectDTO[],
    public readonly users: BoardUserDTO[],
  ) {}

}