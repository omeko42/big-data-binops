"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheCoreModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const keyv_1 = require("keyv");
const cacheable_1 = require("cacheable");

let CacheCoreModule = class CacheCoreModule {
};
exports.CacheCoreModule = CacheCoreModule;
exports.CacheCoreModule = CacheCoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => {
                    const redisEnabled = String(process.env.REDIS_FORCE_DISABLE || 'false').toLowerCase() !== 'true';
                    const redisHost = process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost' ? process.env.REDIS_HOST : 'bdb-redis';
                    const redisPort = Number(process.env.REDIS_PORT) || 6379;
                    const memoryTtl = Number(process.env.MEMORY_CACHE_TTL_MS) || 60000;

                    const stores = [];

                    if (redisEnabled) {
                        try {
                            const kr = require("@keyv/redis");
                            const KeyvRedis = kr.default || kr;
                            const redisStore = new KeyvRedis(`redis://${redisHost}:${redisPort}`);
                            stores.push(new keyv_1.Keyv({ store: redisStore, namespace: 'cas' }));
                            console.log(`[CacheCoreModule] Connected to Redis Cache at redis://${redisHost}:${redisPort}`);
                        } catch (err) {
                            console.error('[CacheCoreModule] Failed to init Redis, falling back to memory:', err.message);
                        }
                    }

                    stores.push(
                        new keyv_1.Keyv({
                            store: new cacheable_1.CacheableMemory({ ttl: memoryTtl, lruSize: 5000 })
                        })
                    );

                    return { stores };
                }
            })
        ],
        providers: [],
        exports: [cache_manager_1.CacheModule]
    })
], CacheCoreModule);
