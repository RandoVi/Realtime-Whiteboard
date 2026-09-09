import { UserService } from '../service/UserService';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(data: CreateUserDTO): Promise<import("mongoose").Document<unknown, {}, import("../schemas/UserSchema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/UserSchema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findOneById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/UserSchema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/UserSchema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/UserSchema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/UserSchema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    patchById(id: string, data: UpdateUserDTO): Promise<import("mongoose").Document<unknown, {}, import("../schemas/UserSchema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/UserSchema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/UserSchema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/UserSchema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
//# sourceMappingURL=UserController.d.ts.map