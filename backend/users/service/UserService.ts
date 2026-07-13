import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../entity/User';
import { UserDTO } from '../dto/UserDTO';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class UserService {
  private users: User[] = []; // stand-in for a real DB-backed repository

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  create(dto: UserDTO): User {
    if (dto.name !== undefined) {
      const user: User = { id: randomUUID(), name: dto.name };
    this.users.push(user);
    return user;
    } else {
      throw new Error("Error creating User: name is undefined");
    }
  }

  async handleRequest(body: unknown) {
    const dto = plainToInstance(UserDTO, body); // turn raw JSON into a UserDTO instance
    const errors = await validate(dto); // run all the decorator rules

    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors)); // reject invalid input
    }

    // dto is now trusted / validated
  }
}