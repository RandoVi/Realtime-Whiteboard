import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/UserSchema";
import { CreateUserDTO } from "../dto/CreateUserDTO";
export declare class UserRepository {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(data: CreateUserDTO): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    findAll(): Promise<UserDocument[]>;
    update(id: string, changes: Partial<User>): Promise<UserDocument | null>;
    delete(id: string): Promise<UserDocument | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map