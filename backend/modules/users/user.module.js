"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const UserController_1 = require("./controller/UserController");
const UserService_1 = require("./service/UserService");
const UserRepository_1 = require("./repository/UserRepository");
const mongoose_1 = require("@nestjs/mongoose");
const UserSchema_1 = require("./schemas/UserSchema");
const user_gateway_1 = require("./user.gateway");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: UserSchema_1.User.name,
                    schema: UserSchema_1.UserSchema,
                },
            ]),
        ],
        controllers: [UserController_1.UserController],
        providers: [
            UserRepository_1.UserRepository,
            UserService_1.UserService,
            user_gateway_1.UserGateway,
        ],
        exports: [UserService_1.UserService], // in case another module needs it later
    })
], UserModule);
//# sourceMappingURL=user.module.js.map