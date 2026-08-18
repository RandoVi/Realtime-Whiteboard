import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { RateLimitOptions,RateLimitResult, } from './rate-limit.types';

interface Bucket {
    timestamps: number[];
}

@Injectable()
export class RateLimiterService implements OnModuleDestroy {
    private readonly buckets = new Map<string, Bucket>();

    private readonly cleanupInterval = setInterval(
        () => this.cleanup(),
        60_000,
    );

    check(key: string, options: RateLimitOptions,): RateLimitResult {
        const now = Date.now();

        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = {
                timestamps: [],
            };

            this.buckets.set(key, bucket);
        }

        // Remove timestamps outside the current window.
        bucket.timestamps = bucket.timestamps.filter(
            (timestamp) => now - timestamp < options.windowMs,
        );

        if (bucket.timestamps.length >= options.limit) {
            const oldestTimestamp = bucket.timestamps[0];

            return {
                allowed: false,
                remaining: 0,
                retryAfterMs:
                options.windowMs - (now - oldestTimestamp!),
            };
        }

        bucket.timestamps.push(now);

        return {
            allowed: true,
            remaining:
                options.limit - bucket.timestamps.length,
            retryAfterMs: 0,
        };
    }

    delete(key: string): void {
        this.buckets.delete(key);
    }

    private cleanup(): void {
        const now = Date.now();

        for (const [key, bucket] of this.buckets.entries()) {
        // Keep only buckets that still contain timestamps.
            bucket.timestamps = bucket.timestamps.filter(
                (timestamp) => now - timestamp < 60_000,
            );

            if (bucket.timestamps.length === 0) {
                this.buckets.delete(key);
            }
        }
    }

    onModuleDestroy(): void {
        clearInterval(this.cleanupInterval);
        this.buckets.clear();
    }
}