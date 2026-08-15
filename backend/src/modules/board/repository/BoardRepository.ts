import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { Board, BoardDocument } from '../schemas/BoardSchema';
import { BoardObject } from '../schemas/BoardObjectSchema';
//import { BoardManager } from '../../../managers/BoardManager';
import { BoardUser } from '../../../models/boardUser';
import { ObjectChange, UserChange } from '../../../common/types/BoardChanges';

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

  async findByCustomId(boardId: string): Promise<BoardDocument | null> {
    return this.boardModel.findOne({id: boardId}).exec();
  }

  async existsByCustomId(boardId: string): Promise<boolean> {
    const exists = await this.boardModel.countDocuments({id: boardId}).exec();
    return exists > 0;
  }

  //  Push(add) a new BoardObject into the embedded BoardObjects array (Atomic)
  async pushBoardObject(boardId: string, object: BoardObject): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        {id: boardId},
        {
          $push: { objects: object },
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
  async upsertBoardObject(boardId: string, object: BoardObject & { id: string }): Promise<BoardDocument> {
    // Try updating BoardObject in-place first matching array element by id
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        { id: boardId, 'objects.id': object.id },
        {
          $set: { 'objects.$': object },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    // If BoardObject.id wasn't in array, push it as new
    if (!updatedBoard) {
      return this.pushBoardObject(boardId, object);
    }

    return updatedBoard;
  }

// Remove a BoardObject by its ID from the board array (Atomic)
  async removeBoardObject(boardId: string, objectId: string): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        {id: boardId},
        {
          $pull: { objects: { id: objectId } },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Board with ID ${boardId} or object ID ${objectId} not found`);
    }

    return updatedBoard;
  }

  // Full canvas state overwrite
  async replaceBoardObjects(boardId: string, objects: BoardObject[]): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        {id: boardId},
        {
          $set: { objects },
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

  async pushBoardUser(boardId: string, user: BoardUser): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        {id: boardId},
        {
          $push: { users: user },
          $inc: { version: 1 },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Board with ID ${boardId} or user ID ${user.userId} not found`);
    }

    return updatedBoard;
  }

  async upsertBoardUser(boardId: string, user: BoardUser,) {
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        { id: boardId, 'users.userId': user.userId },
        {
          $set: { 'users.$': user },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();

    // If BoardUser.userId wasn't in array, push it as new
    if (!updatedBoard) {
      return this.pushBoardUser(boardId, user);
    }

    return updatedBoard;
  }

  async removeBoardUser(boardId: string, userId: string,) {
    const updatedBoard = await this.boardModel
      .findOneAndUpdate(
        {id: boardId},
        {
          $pull: { users: { userId: userId } },
        },
        { new: true },
      )
      .exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Board with ID ${boardId} or user ID ${userId} not found`);
    }

    return updatedBoard;
  }

  async updateLastActivity(boardId: string, lastActivity: Date): Promise<void> {
    await this.boardModel.updateOne(
        { id: boardId },
        {
            $set: { lastActivity },
        },
    ).exec();
  }

  async deleteExpiredBoards(cutoff: Date) {
    return this.boardModel.deleteMany({
        lastActivity: { $lt: cutoff },
    }).exec();
}

  async saveManyCreatedObjects(changes: Extract<ObjectChange, { type: 'create' }>[],): Promise<void> {
      if (changes.length === 0) {
          return;
      }

      const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
          changes.map((change) => ({
              updateOne: {
                  filter: {
                    id: change.boardId,
                    'objects.id': { $ne: change.object.id },
                    },
                  update: {
                      $push: {
                          objects: change.object,
                      },
                      $inc: {
                          version: 1,
                      },
                  },
              },
          }));

      await this.boardModel.bulkWrite(bulkOps);
  }
  async saveManyUpdatedObjects(changes: Extract<ObjectChange, { type: 'update' }>[],): Promise<void> {
    if (changes.length === 0) {
        return;
    }

    const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
        changes.map((change) => ({
            updateOne: {
                filter: {
                    id: change.boardId,
                    'objects.id': change.object.id,
                },
                update: {
                    $set: {
                        'objects.$': change.object,
                    },
                    $inc: {
                        version: 1,
                    },
                },
            },
        }));

    const result = await this.boardModel.bulkWrite(bulkOps);

    console.log(
    `Updated objects: matched=${result.matchedCount}, modified=${result.modifiedCount}`
);
  }

    async saveManyDeletedObjects(changes: Extract<ObjectChange, { type: 'remove' }>[],): Promise<void> {
      if (changes.length === 0) {
          return;
      }

      const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
          changes.map((change) => ({
              updateOne: {
                  filter: {
                      id: change.boardId,
                  },
                  update: {
                      $pull: {
                          objects: {
                            id: change.objectId
                          }
                      },
                      $inc: {
                          version: 1,
                      },
                  },
              },
          }));

      const result = await this.boardModel.bulkWrite(bulkOps);

      console.log('DELETE OBJECTS:', result);
    }


    // ---------------------------------------------------------
    // USERS
    // ---------------------------------------------------------

    async saveManyCreatedUsers(changes: Extract<UserChange, { type: 'create' }>[],): Promise<void> {
      if (changes.length === 0) {
          return;
      }

      const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
          changes.map((change) => ({
              updateOne: {
                  filter: {
                      id: change.boardId,
                      'users.userId': { $ne: change.user.userId },
                  },
                  update: {
                      $push: {
                          users: change.user,
                      },
                      $inc: {
                          version: 1,
                      },
                  },
              },
          }));

      await this.boardModel.bulkWrite(bulkOps);
  }
  async saveManyUpdatedUsers(changes: Extract<UserChange, { type: 'update' }>[],): Promise<void> {
    if (changes.length === 0) {
        return;
    }

    const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
        changes.map((change) => ({
            updateOne: {
                filter: {
                    id: change.boardId,
                    'users.userId': change.user.userId,
                },
                update: {
                    $set: {
                        'users.$': change.user,
                    },
                    $inc: {
                        version: 1,
                    },
                },
            },
        }));

    const result = await this.boardModel.bulkWrite(bulkOps);

    console.log(
    `Updated users: matched=${result.matchedCount}, modified=${result.modifiedCount}`
);
  }

    async saveManyDeletedUsers(changes: Extract<UserChange, { type: 'remove' }>[],): Promise<void> {
      if (changes.length === 0) {
          return;
      }

      const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
          changes.map((change) => ({
              updateOne: {
                  filter: {
                      id: change.boardId,
                  },
                  update: {
                      $pull: {
                          users: {
                            userId: change.userId
                          }
                      },
                      $inc: {
                          version: 1,
                      },
                  },
              },
          }));

      const result = await this.boardModel.bulkWrite(bulkOps);

      console.log('DELETE USERS:', result);
    }

    // ---------------------------------------------------------
    // BOARD METADATA
    // ---------------------------------------------------------

    async saveManyActivityUpdates(
        updates: {
            boardId: string;
            lastActivity: Date;
        }[],
    ): Promise<void> {

        if (updates.length === 0) {
            return;
        }

        const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
            updates.map((update) => ({
                updateOne: {
                    filter: {
                        id: update.boardId,
                    },

                    update: {
                        $set: {
                            lastActivity: update.lastActivity,
                        },
                    },
                },
            }));
        await this.boardModel.bulkWrite(bulkOps);
    }
}