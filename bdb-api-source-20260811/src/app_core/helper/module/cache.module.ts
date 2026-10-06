import { Module, Global } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => {
                const redisEnabled = String(process.env.REDIS_FORCE_DISABLE || 'false').toLowerCase() !== 'true';
                const redisHost = process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost' ? process.env.REDIS_HOST : 'bdb-redis';
                const redisPort = Number(process.env.REDIS_PORT) || 6379;
                const memoryTtl = Number(process.env.MEMORY_CACHE_TTL_MS) || 60000;

                const stores = [];

                if (redisEnabled) {
                    try {
                        const kr = require('@keyv/redis');
                        const KeyvRedis = kr.default || kr;
                        const redisStore = new KeyvRedis(`redis://${redisHost}:${redisPort}`);
                        stores.push(new Keyv({ store: redisStore, namespace: 'cas' }));
                        console.log(`[CacheCoreModule] Connected to Redis Cache at redis://${redisHost}:${redisPort}`);
                    } catch (err) {
                        console.error('[CacheCoreModule] Failed to initialize Redis store, falling back to memory:', err.message);
                    }
                }

                stores.push(
                    new Keyv({
                        store: new CacheableMemory({ ttl: memoryTtl, lruSize: 5000 })
                    })
                );

                return { stores };
            }
        })
    ],
    providers: [],
    exports: [CacheModule]
})
export class CacheCoreModule {}

