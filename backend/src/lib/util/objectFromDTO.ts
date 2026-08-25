import { BoardObjectDTO } from "../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";

export function BoardObjectFromDTO(dto: BoardObjectDTO): BoardObject {
    return new BoardObject(dto);
}