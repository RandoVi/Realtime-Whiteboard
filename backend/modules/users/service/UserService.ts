import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserDocument } from '../schemas/UserSchema';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserRepository } from '../repository/UserRepository';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDTO): Promise<UserDocument> {

    const existingUser = await this.userRepository.findByEmail(
      data.email,
    );


  if (existingUser) {
    throw new Error(
      "Email already exists",
    );
  }


  return this.userRepository.create(data);
  
  }
  async findOneById(id: string): Promise<UserDocument> {

    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userRepository.findAll();
  }

  async updateById(id:string, changes:UpdateUserDTO):Promise<UserDocument>{

    const user = await this.userRepository.update(id,changes);

    if (!user) {
      throw new Error(
        "User not found",
      );
    }

    return user;
  }

  async deleteById(id: string):Promise<UserDocument | null> {
    //It fetches the document of the user that was deleted as confirmation
    const deletedUser = await this.userRepository.delete(id);

    if (!deletedUser) {

      throw new NotFoundException(
        'User not found',
      );
    }

    return deletedUser;
  }
}