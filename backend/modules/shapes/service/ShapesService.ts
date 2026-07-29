import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shape, ShapeDocument } from '../schemas/ShapeSchema';
import { BoardObject } from '../schemas/ShapeSchema';

@Injectable()
export class ShapesService {
  constructor(
    @InjectModel(Shape.name) private readonly shapeModel: Model<ShapeDocument>,
  ) {}

  // Create any shape implementation dynamically
  async create(shapeDTO: BoardObject): Promise<Shape> {
    //This creates a new Mongoose factory(shapeModel that is injected above) as a wrapper around the DTO, thus creating a new document that can be saved in the database with
    // all the bells and whistles Mongoose attaches.
    const newShape = new this.shapeModel(shapeDTO);
    return newShape.save();
  }

  // Retrieve all shapes regardless of concrete type
  async findAll(): Promise<Shape[]> {
    return this.shapeModel.find().exec();
  }

  // Retrieve shapes filtered by kind (e.g., all circles)
  async findByKind(kind: string): Promise<Shape[]> {
    return this.shapeModel.find({ kind }).exec();
  }

  // Find a specific shape by ID
  async findById(id: string): Promise<Shape> {
    const shape = await this.shapeModel.findById(id).exec();
    if (!shape) {
      throw new NotFoundException(`Shape with ID ${id} not found`);
    }
    return shape;
  }

  // Delete a shape
  async delete(id: string): Promise<void> {
    const result = await this.shapeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Shape with ID ${id} not found`);
    }
  }
}