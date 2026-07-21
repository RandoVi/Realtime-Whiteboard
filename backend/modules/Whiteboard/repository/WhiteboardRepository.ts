import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Whiteboard, WhiteboardDocument } from "../schemas/WhiteboardSchema";
import { CreateWhiteboardDTO } from "../dto/CreateWhiteboardDTO";

@Injectable()
export class WhiteboardRepository {

  constructor(
      @InjectModel(Whiteboard.name)
      private readonly WhiteboardModel: Model<WhiteboardDocument>,
    ) {}

  async create(data: CreateWhiteboardDTO): Promise<WhiteboardDocument> {
    return this.WhiteboardModel.create(data);
  }

  async findByName(name: string): Promise<WhiteboardDocument | null> {
    return this.WhiteboardModel.findOne({
      name,
    });
  }

  async findById(id: string): Promise<WhiteboardDocument | null> {
    return this.WhiteboardModel.findById(id);
  }

  async findAll(): Promise<WhiteboardDocument[]> {
    return this.WhiteboardModel.find();
  }
  
  async update(id: string, changes: Partial<Whiteboard>): Promise<WhiteboardDocument | null> {
    return this.WhiteboardModel.findByIdAndUpdate(
      id,
      changes,
      {
        new: true,
      },
    );
  }

  async delete(id: string): Promise<WhiteboardDocument | null> {
    return this.WhiteboardModel.findByIdAndDelete(id);
  }
}