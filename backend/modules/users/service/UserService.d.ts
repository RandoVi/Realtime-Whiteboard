import { UserDocument } from '../schemas/UserSchema';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserRepository } from '../repository/UserRepository';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(data: CreateUserDTO): Promise<UserDocument>;
    findOneById(id: string): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    updateById(id: string, changes: UpdateUserDTO): Promise<UserDocument>;
    deleteById(id: string): Promise<UserDocument | null>;
}
//# sourceMappingURL=UserService.d.ts.map