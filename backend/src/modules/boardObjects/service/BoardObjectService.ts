import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardObject, BoardObjectDocument } from '../schemas/BoardObjectSchema';

@Injectable()
export class BoardObjectsService {
  constructor(
    @InjectModel(BoardObject.name) private readonly BoardObjectModel: Model<BoardObjectDocument>,
  ) {}

  // Create any BoardObject implementation dynamically
  async create(BoardObjectDTO: BoardObject): Promise<BoardObject> {
    //This creates a new Mongoose factory(BoardObjectModel that is injected above) as a wrapper around the DTO, thus creating a new document that can be saved in the database with
    // all the bells and whistles Mongoose attaches.
    const newBoardObject = new this.BoardObjectModel(BoardObjectDTO);
    return newBoardObject.save();
  }

  // Retrieve all BoardObjects regardless of concrete type
  async findAll(): Promise<BoardObject[]> {
    return this.BoardObjectModel.find().exec();
  }

  // Retrieve BoardObjects filtered by kind (e.g., all circles)
  async findByKind(kind: string): Promise<BoardObject[]> {
    return this.BoardObjectModel.find({ kind }).exec();
  }

  // Find a specific BoardObject by ID
  async findById(id: string): Promise<BoardObject> {
    const BoardObject = await this.BoardObjectModel.findById(id).exec();
    if (!BoardObject) {
      throw new NotFoundException(`BoardObject with ID ${id} not found`);
    }
    return BoardObject;
  }

  // Delete a BoardObject
  async delete(id: string): Promise<void> {
    const result = await this.BoardObjectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`BoardObject with ID ${id} not found`);
    }
  }
}