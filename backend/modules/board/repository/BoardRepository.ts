import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, BoardDocument } from '../schemas/BoardSchema';
import { BoardObject } from '../../shapes/schemas/ShapeSchema';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
  ) {}

  async create(ownerId: string, title: string): Promise<BoardDocument> {
    const board = new this.boardModel({
      ownerId,
      title,
      shapes: [],
      version: 0,
    });
    return board.save();
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