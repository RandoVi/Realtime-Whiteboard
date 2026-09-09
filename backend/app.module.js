"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const whiteboard_module_1 = require("./modules/Whiteboard/whiteboard.module");
const chat_module_1 = require("./modules/chat/chat.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("./modules/users/user.module");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("@nestjs/config");
dotenv_1.default.config();
const url = process.env.DATABASE_URL;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            // This prevents mongoose from crashing due to undefined url and breaks it immediately.
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.getOrThrow('DATABASE_URL'),
                }),
            }),
            // Example injection of env variables using config service managed by nestJS, which allows for safer and more reusable injections.
            //   @Injectable()
            //   export class AuthService {
            //   constructor(private readonly config: ConfigService) {}
            //   getSecret() {
            //     return this.config.getOrThrow<string>('JWT_SECRET');
            //     }
            //   }
            user_module_1.UserModule, whiteboard_module_1.WhiteboardModule, chat_module_1.ChatModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map