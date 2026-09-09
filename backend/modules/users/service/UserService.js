"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const UserRepository_1 = require("../repository/UserRepository");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already exists");
        }
        return this.userRepository.create(data);
    }
    async findOneById(id) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException(`User with ${id} not found`);
        return user;
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async updateById(id, changes) {
        const user = await this.userRepository.update(id, changes);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async deleteById(id) {
        //It fetches the document of the user that was deleted as confirmation
        const deletedUser = await this.userRepository.delete(id);
        if (!deletedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return deletedUser;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository])
], UserService);
//# sourceMappingURL=UserService.js.map