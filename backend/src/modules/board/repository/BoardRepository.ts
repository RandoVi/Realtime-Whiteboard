import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { Board, BoardDocument } from '../schemas/BoardSchema';
import { BoardObject } from '../../boardObjects/schemas/BoardObjectSchema';
import { BoardManager } from '../../../managers/BoardManager';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
  ) {}

  async create(id: string, ownerId: string): Promise<BoardDocument> {
    const board = new this.boardModel({
      id: id, // double id for simplicity for now
      ownerId,
    });
    return board.save();
  }

  async saveManyBoardUpdates(boards: BoardManager[]): Promise<void> {
    // Guard against empty calls to avoid sending unnecessary commands to MongoDB
    if (!boards || boards.length === 0) {
      return;
    }

    // Map each BoardManager instance into a Mongoose bulkWrite operation
    const bulkOps: AnyBulkWriteOperation<BoardDocument>[] = boards.map((board) => {
      // Extract pure data from the in-memory board manager instance
      const data = board.toPersistence();

      return {
        updateOne: {
          filter: { id: data.id },
          
          update: { 
            $set: {
              ownerId: data.ownerId,
              objects: data.objects,
            } 
          },
          
          // Upsert option: if the document doesn't exist yet in DB, create it!
          upsert: true,
        },
      };
    });

    // Execute all update operations atomically in a SINGLE network round-trip
    await this.boardModel.bulkWrite(bulkOps);
  }

  async findById(boardId: string): Promise<BoardDocument | null> {
    return this.boardModel.findById(boardId).exec();
  }

  // (Leverages { ownerId: 1, status: 1 } index)
  async findActiveUserBoards(ownerId: string): Promise<BoardDocument[]> {
    return this.boardModel.find({ ownerId, status: 'active' }).exec();
  }

  //  Push(add) a new BoardObject into the embedded BoardObjects array (Atomic)
  async pushBoardObject(boardId: string, BoardObject: BoardObject): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        boardId,
        {
          $push: { BoardObjects: BoardObject },
          $inc: { version: 1 },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }

    return updatedBoard;
  }

  // Update an existing BoardObject inside the array or push it if missing (Upsert behavior)
  async upsertBoardObject(boardId: string, boardObject: BoardObject & { id: string }): Promise<BoardDocument> {
    // Try updating BoardObject in-place first matching array element by id
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        { id: boardId, 'BoardObjects.id': boardObject.id },
        {
          $set: { 'boardObjects.$': boardObject },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    // If BoardObject.id wasn't in array, push it as new
    if (!updatedBoard) {
      return this.pushBoardObject(boardId, boardObject);
    }

    return updatedBoard;
  }

// Remove a BoardObject by its ID from the board array (Atomic)
  async pullBoardObject(boardId: string, boardObjectId: string): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        boardId,
        {
          $pull: { boardObjects: { id: boardObjectId } },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }

    return updatedBoard;
  }

  // Full canvas state overwrite (Used when saving bulk canvas imports or snapshots)
  async replaceBoardObjects(boardId: string, boardObjects: BoardObject[]): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        boardId,
        {
          $set: { boardObjects },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }

    return updatedBoard;
  }

  // Delete entire board document
  async deleteBoard(boardId: string): Promise<boolean> {
    const result = await this.boardModel.findByIdAndDelete(boardId).exec();
    return result !== null;
  }
}