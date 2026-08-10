import { PresenceCommand } from "@whiteboard/common";

export type BoardObjectPresenceDTO = {
  id: string;
  userId: string;
  boardId: string;
  command: PresenceCommand;
};