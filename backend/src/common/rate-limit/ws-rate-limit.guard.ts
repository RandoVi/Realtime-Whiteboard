import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

import { RATE_LIMIT_KEY } from './rate-limit.decorator';
import { RateLimiterService } from '../rate-limit/rate-limit.service';
import { RateLimitOptions } from '../rate-limit/rate-limit.types';

@Injectable()
export class WsRateLimitGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly rateLimiter: RateLimiterService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const options =
        this.reflector.get<RateLimitOptions>(
            RATE_LIMIT_KEY,
            context.getHandler(),
        );

        if (!options) {
            return true;
        }

        const client = context.switchToWs().getClient();

        const userId = client.data?.userId;

        // If authentication hasn't happened yet,
        // fall back to socket ID.
        const identifier = userId ?? client.id;

        const eventName = context.getHandler().name;

        const key = `ws:${identifier}:${eventName}`;

        const result = this.rateLimiter.check(
            key,
            options,
        );

        if (!result.allowed) {
            throw new WsException({
                message: 'Rate limit exceeded',
                retryAfterMs: result.retryAfterMs,
            });
        }

        return true;
    }
}