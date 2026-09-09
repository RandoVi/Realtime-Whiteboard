import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { Board, BoardDocument } from '../schemas/BoardSchema';
import { ObjectChange, UserChange } from '../../../lib/types/BoardChanges';

@Injectable()
    export class BoardRepository {

    private readonly logger = new Logger(BoardRepository.name);

    constructor(
        @InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>,
    ) {}

    async create(id: string, ownerId: string): Promise<BoardDocument> {
        const board = new this.boardModel({
        id: id, // double id for simplicity for now
        ownerId: ownerId,
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

        const result = await this.boardModel.bulkWrite(bulkOps);
        this.logger.log(`MONGO: Created objects: matched=${result.matchedCount} and modified=${result.modifiedCount}`);
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

    this.logger.log(`MONGO: Updated objects: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
    }

    async saveManyReorderedObjects(changes: Extract<ObjectChange, { type: 'reorder' }>[],): Promise<void> {
        if (changes.length === 0) {
            return;
        }

        const bulkOps: AnyBulkWriteOperation<BoardDocument>[] =
            changes.map((change) => ({
                updateOne: {
                    filter: {
                        id: change.boardId,
                        'objects.id': change.objectId,
                    },
                    update: [
                        {
                            $set: {
                                objects: {
                                    $concatArrays: [
                                        // Everything except the object being moved
                                        {
                                            $filter: {
                                                input: '$objects',
                                                as: 'object',
                                                cond: {
                                                    $ne: [
                                                        '$$object.id',
                                                        change.objectId,
                                                    ],
                                                },
                                            },
                                        },

                                        // The object being moved
                                        {
                                            $filter: {
                                                input: '$objects',
                                                as: 'object',
                                                cond: {
                                                    $eq: [
                                                        '$$object.id',
                                                        change.objectId,
                                                    ],
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $set: {
                                version: {
                                    $add: ['$version', 1],
                                },
                            },
                        },
                    ],
                },
            }));

        const result = await this.boardModel.bulkWrite(bulkOps);

        this.logger.log(
            `MONGO: Reordered objects: matched=${result.matchedCount}, modified=${result.modifiedCount}`,
        );
    }

    async saveManyDeletedObjects(changes: Extract<ObjectChange, { type: 'delete' }>[],): Promise<void> {
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

        this.logger.log(
        `MONGO: Deleted objects matched=${result.matchedCount}, modified=${result.modifiedCount}`,
        );
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

        const result = await this.boardModel.bulkWrite(bulkOps);
        this.logger.log(`MONGO: Created users: matched=${result.matchedCount} and modified=${result.modifiedCount}`,);
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

        this.logger.log(`MONGO: Updated users: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
    }

    async saveManyDeletedUsers(changes: Extract<UserChange, { type: 'delete' }>[],): Promise<void> {
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

        this.logger.log(`MONGO: Deleted users matched=${result.matchedCount},  and modified=${result.modifiedCount}`);
    }

    // ---------------------------------------------------------
    // BOARD METADATA
    // ---------------------------------------------------------

    async saveManyActivityUpdates(updates: {boardId: string;lastActivity: Date;}[],): Promise<void> {

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
                      // Only replace if the new value is greater
                        $max: {
                            lastActivity: update.lastActivity,
                        },
                    },
                },
            }));
        await this.boardModel.bulkWrite(bulkOps);
    }
}