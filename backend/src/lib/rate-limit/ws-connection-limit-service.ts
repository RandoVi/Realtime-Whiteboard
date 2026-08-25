import { Injectable } from '@nestjs/common';

@Injectable()
export class WsConnectionLimitService {
    private readonly connections = new Map<string, number>();

    connect( userId: string, maxConnections: number, ): boolean {
        const current = this.connections.get(userId) ?? 0;

        if (current >= maxConnections) {
            return false;
        }

        this.connections.set(userId, current + 1,);

        return true;
    }

    disconnect(userId: string): void {
        const current = this.connections.get(userId) ?? 0;

        if (current <= 1) {
            this.connections.delete(userId);
            return;
        }

        this.connections.set( userId, current - 1 ,);
    }

    getConnectionCount(userId: string): number {
        return this.connections.get(userId) ?? 0;
    }
}