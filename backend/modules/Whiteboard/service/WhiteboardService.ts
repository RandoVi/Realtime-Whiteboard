import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Whiteboard, WhiteboardDocument } from '../schemas/WhiteboardSchema';
import { CreateWhiteboardDTO } from '../dto/CreateWhiteboardDTO';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { WhiteboardRepository } from '../repository/WhiteboardRepository';
import { UpdateWhiteboardDTO } from '../dto/UpdateWhiteboardDTO';

@Injectable()
export class WhiteboardService {

  constructor(
    private readonly WhiteboardRepository: WhiteboardRepository,
  ) {}

  async create(data: CreateWhiteboardDTO): Promise<WhiteboardDocument> {

    const existingWhiteboard = await this.WhiteboardRepository.findByName(
      data.name,
    );


  if (existingWhiteboard) {
    throw new Error(
      "Whiteboard with this name already exists",
    );
  }


  return this.WhiteboardRepository.create(data);
  
  }
  async findOneById(id: string): Promise<WhiteboardDocument> {

    const Whiteboard = await this.WhiteboardRepository.findById(id);

    if (!Whiteboard) throw new NotFoundException(`Whiteboard with ${id} not found`);

    return Whiteboard;
  }

  async findAll(): Promise<WhiteboardDocument[]> {
    return this.WhiteboardRepository.findAll();
  }

  async updateById(id:string, changes:UpdateWhiteboardDTO):Promise<WhiteboardDocument>{

    const Whiteboard = await this.WhiteboardRepository.update(id,changes);

    if (!Whiteboard) {
      throw new Error(
        "Whiteboard not found",
      );
    }

    return Whiteboard;
  }

  async deleteById(id: string):Promise<WhiteboardDocument | null> {
    //It fetches the document of the Whiteboard that was deleted as confirmation
    const deletedWhiteboard = await this.WhiteboardRepository.delete(id);

    if (!deletedWhiteboard) {

      throw new NotFoundException(
        'Whiteboard not found',
      );
    }

    return deletedWhiteboard;
  }
}