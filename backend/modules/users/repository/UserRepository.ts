import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/UserSchema";
import { CreateUserDTO } from "../dto/CreateUserDTO";

@Injectable()
export class UserRepository {

  constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<UserDocument>,
    ) {}

  async create(data: CreateUserDTO): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      email,
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }
  
  async update(id: string, changes: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      changes,
      {
        new: true,
      },
    );
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}