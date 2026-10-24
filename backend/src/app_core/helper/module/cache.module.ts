import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => {
                const memoryTtl = Number(process.env.MEMORY_CACHE_TTL_MS) || 60000;
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: memoryTtl, lruSize: 5000 })
                        })
                    ]
                };
            }
        })
    ],
    providers: [
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor
        // }
    ],
    exports: [CacheModule]
})
export class CacheCoreModule {}
