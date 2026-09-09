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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const CreateUserDTO_1 = require("./dto/CreateUserDTO");
const UserService_1 = require("./service/UserService");
let UserGateway = class UserGateway {
    UserService;
    server;
    constructor(UserService) {
        this.UserService = UserService;
    }
    handleConnection(client, ...args) {
        console.log("A user has connected: " + client.id);
    }
    handleDisconnect(client) {
        console.log("A user has disconnected: " + client.id);
    }
    handlePing(data, client) {
        console.log('Received:', data);
        return {
            event: 'pong',
            data: {
                message: 'Hello frontend!',
            },
        };
    }
    async handleUserEvent(data) {
        await this.UserService.create(data);
        console.log("A user has been created through a websocket");
    }
};
exports.UserGateway = UserGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], UserGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], UserGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('CreateUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDTO_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], UserGateway.prototype, "handleUserEvent", null);
exports.UserGateway = UserGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [UserService_1.UserService])
], UserGateway);
//# sourceMappingURL=user.gateway.js.map