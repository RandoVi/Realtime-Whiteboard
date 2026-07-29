import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { Board, BoardDocument } from '../schemas/BoardSchema';
import { BoardObject } from '../../shapes/schemas/ShapeSchema';
import { BoardManager } from '../../../managers/BoardManager';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
  ) {}

  async create(id: string, ownerId: string): Promise<BoardDocument> {
    const board = new this.boardModel({
      _id: id, // Custom id instead of default
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
          filter: { _id: data._id },
          
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

  //  Push(add) a new shape into the embedded shapes array (Atomic)
  async pushShape(boardId: string, shape: BoardObject): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        boardId,
        {
          $push: { shapes: shape },
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

  // Update an existing shape inside the array or push it if missing (Upsert behavior)
  async upsertShape(boardId: string, shape: BoardObject & { id: string }): Promise<BoardDocument> {
    // Try updating shape in-place first matching array element by id
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        { _id: boardId, 'shapes.id': shape.id },
        {
          $set: { 'shapes.$': shape },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    // If shape.id wasn't in array, push it as new
    if (!updatedBoard) {
      return this.pushShape(boardId, shape);
    }

    return updatedBoard;
  }

// Remove a shape by its ID from the board array (Atomic)
  async pullShape(boardId: string, shapeId: string): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        boardId,
        {
          $pull: { shapes: { id: shapeId } },
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
  async replaceShapes(boardId: string, shapes: BoardObject[]): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        boardId,
        {
          $set: { shapes },
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