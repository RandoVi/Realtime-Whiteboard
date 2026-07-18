import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { WhiteboardEventSchema } from '../schemas/WhiteboardEventSchema';
import { WhiteboardEventDTO } from '../dto/WhiteboardEventDTO';
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class WhiteboardService {
  private events: WhiteboardEventSchema[] = []; // stand-in for a real DB-backed repository

  async findAll(): Promise<WhiteboardEventSchema[]> {
    return this.events;
  }

  async findOne(id: string): Promise<WhiteboardEventSchema> {
    const event = this.events.find((e) => e.id === id);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async create(dto: WhiteboardEventDTO): Promise<WhiteboardEventSchema> {
    if (dto.name !== undefined) {
      const event: WhiteboardEventSchema = { id: randomUUID(), name: dto.name };
    this.events.push(event);
    return event;
    } else {
      throw new Error("Error creating event: name is undefined");
    }
  }

  async saveEvent(event: WhiteboardEventDTO) {
    const dto = plainToInstance(WhiteboardEventDTO, event); // turn raw JSON into a UserDTO instance
    const errors = await validate(dto); // run all the decorator rules

    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors)); // reject invalid input
    }

    // dto is now trusted / validated
  }
}