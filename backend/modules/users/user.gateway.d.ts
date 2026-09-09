import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateUserDTO } from "./dto/CreateUserDTO";
import { UserService } from "./service/UserService";
export declare class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly UserService;
    server: Server;
    constructor(UserService: UserService);
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(client: any): void;
    handlePing(data: any, client: Socket): {
        event: string;
        data: {
            message: string;
        };
    };
    handleUserEvent(data: CreateUserDTO): Promise<void>;
}
//# sourceMappingURL=user.gateway.d.ts.map